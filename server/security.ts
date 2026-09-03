import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { z } from 'zod';



const SESSION_SECRET: string = process.env.SESSION_SECRET || 'mpdrec_prod_session_secret_key_88492019_salt';
const WEBHOOK_SECRET: string = process.env.WEBHOOK_SECRET || 'mpdrec_prod_webhook_secret_key_88492019';


const BCRYPT_SALT_ROUNDS = 12;


export type SecurityLogLevel = 'INFO' | 'WARN' | 'SECURITY_ALERT';

export function logSecurityEvent(
  level: SecurityLogLevel,
  action: string,
  details: {
    ip?: string;
    userId?: string;
    role?: string;
    resource?: string;
    outcome: 'SUCCESS' | 'DENIED' | 'FAILED' | 'LOCKED' | 'RATE_LIMITED';
    reason?: string;
    metadata?: Record<string, any>;
  }
) {
  
  const rawIp = details.ip || 'unknown';
  const anonymizedIp = rawIp.includes('.')
    ? rawIp.replace(/\.\d+$/, '.xxx')
    : rawIp.slice(0, 12) + '...';

  const logEntry = {
    timestamp: new Date().toISOString(),
    service: 'MPDREC_SECURITY_GATEWAY',
    level,
    action,
    ip: anonymizedIp,
    userId: details.userId || 'anonymous',
    role: details.role || 'unauthenticated',
    resource: details.resource || 'none',
    outcome: details.outcome,
    reason: details.reason,
    metadata: details.metadata,
  };

  const output = `[SECURITY_AUDIT] ${JSON.stringify(logEntry)}`;
  if (level === 'SECURITY_ALERT') {
    console.error(output);
  } else if (level === 'WARN') {
    console.warn(output);
  } else {
    console.log(output);
  }
}



interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();


export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const windowStart = now - windowMs;

  let record = rateLimitStore.get(key);
  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(key, record);
  }


  record.timestamps = record.timestamps.filter(ts => ts > windowStart);

  if (record.timestamps.length >= limit) {
    const oldest = record.timestamps[0];
    const resetTime = Math.ceil((oldest + windowMs - now) / 1000);
    return { allowed: false, remaining: 0, resetTime };
  }

  record.timestamps.push(now);
  const remaining = limit - record.timestamps.length;
  const resetTime = Math.ceil(windowMs / 1000);
  return { allowed: true, remaining, resetTime };
}


setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    record.timestamps = record.timestamps.filter(ts => ts > now - 120000);
    if (record.timestamps.length === 0) {
      rateLimitStore.delete(key);
    }
  }
}, 60000);



interface FailedAttemptRecord {
  count: number;
  lastAttempt: number;
  lockedUntil: number | null;
}

const failedAuthStore = new Map<string, FailedAttemptRecord>();
const MAX_FAILED_ATTEMPTS = 10;
const LOCKOUT_DURATION_MS = 3 * 60 * 1000; 

export function getAccountLockoutStatus(identifier: string): { isLocked: boolean; remainingSeconds: number } {
  const record = failedAuthStore.get(identifier.toLowerCase());
  if (!record || !record.lockedUntil) return { isLocked: false, remainingSeconds: 0 };

  const now = Date.now();
  if (now < record.lockedUntil) {
    const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return { isLocked: true, remainingSeconds };
  }


  failedAuthStore.delete(identifier.toLowerCase());
  return { isLocked: false, remainingSeconds: 0 };
}

export function recordFailedAuth(identifier: string): { attempts: number; isLocked: boolean; backoffMs: number } {
  const key = identifier.toLowerCase();
  const now = Date.now();
  let record = failedAuthStore.get(key);

  if (!record) {
    record = { count: 0, lastAttempt: now, lockedUntil: null };
  }

  record.count += 1;
  record.lastAttempt = now;

  let isLocked = false;
  if (record.count >= MAX_FAILED_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION_MS;
    isLocked = true;
  }

  failedAuthStore.set(key, record);


  const backoffMs = Math.min(1000 * Math.pow(2, record.count - 1), 5000);
  return { attempts: record.count, isLocked, backoffMs };
}

export function resetFailedAuth(identifier: string): void {
  failedAuthStore.delete(identifier.toLowerCase());
}



export interface SessionPayload {
  userId: string;
  role: string;
  name: string;
  email: string;
  department?: string;
  branch?: string;
  semester?: number;
  issuedAt: number;
  expiresAt: number;
  sessionId: string;
}


const activeSessionRegistry = new Map<string, SessionPayload>();

export function createSignedSessionToken(data: Omit<SessionPayload, 'issuedAt' | 'expiresAt' | 'sessionId'>): {
  token: string;
  payload: SessionPayload;
} {
  const issuedAt = Date.now();
  const expiresAt = issuedAt + 8 * 60 * 60 * 1000; 
  const sessionId = crypto.randomUUID();

  const payload: SessionPayload = {
    ...data,
    issuedAt,
    expiresAt,
    sessionId,
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payloadB64)
    .digest('base64url');

  const token = `${payloadB64}.${signature}`;
  activeSessionRegistry.set(sessionId, payload);

  return { token, payload };
}

export function verifySignedSessionToken(token: string): SessionPayload | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadB64, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payloadB64)
    .digest('base64url');


  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expectedSignature);
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  try {
    const rawJson = Buffer.from(payloadB64, 'base64url').toString('utf-8');
    const payload: SessionPayload = JSON.parse(rawJson);


    if (Date.now() > payload.expiresAt) {
      activeSessionRegistry.delete(payload.sessionId);
      return null;
    }


    if (!activeSessionRegistry.has(payload.sessionId)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function invalidateSession(token: string): void {
  const session = verifySignedSessionToken(token);
  if (session) {
    activeSessionRegistry.delete(session.sessionId);
  }
}


interface ResetTokenRecord {
  identifier: string;
  hashedToken: string;
  expiresAt: number;
  used: boolean;
}

const passwordResetTokens = new Map<string, ResetTokenRecord>();
const customUserPasswords = new Map<string, string>(); 

export async function hashPassword(plainText: string): Promise<string> {
  return await bcrypt.hash(plainText, BCRYPT_SALT_ROUNDS);
}

export async function verifyPasswordHash(plainText: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(plainText, hash);
}

export function generatePasswordResetToken(identifier: string): { plainToken: string; expiresAt: number } {
  const plainToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(plainToken).digest('hex');
  const expiresAt = Date.now() + 15 * 60 * 1000; 

  passwordResetTokens.set(hashedToken, {
    identifier: identifier.toLowerCase(),
    hashedToken,
    expiresAt,
    used: false,
  });

  return { plainToken, expiresAt };
}

export async function consumePasswordResetToken(
  plainToken: string,
  newPlainPassword: string
): Promise<{ success: boolean; identifier?: string; error?: string }> {
  if (!plainToken || typeof plainToken !== 'string') {
    return { success: false, error: 'Invalid or missing reset token' };
  }

  const hashedToken = crypto.createHash('sha256').update(plainToken).digest('hex');
  const record = passwordResetTokens.get(hashedToken);

  if (!record) {
    return { success: false, error: 'Password reset token not found or already consumed' };
  }

  if (record.used) {
    return { success: false, error: 'Password reset token has already been used' };
  }

  if (Date.now() > record.expiresAt) {
    passwordResetTokens.delete(hashedToken);
    return { success: false, error: 'Password reset token has expired (15 minute validity)' };
  }


  record.used = true;
  passwordResetTokens.delete(hashedToken);


  const newHash = await hashPassword(newPlainPassword);
  customUserPasswords.set(record.identifier, newHash);

  return { success: true, identifier: record.identifier };
}

export function getCustomUserPasswordHash(identifier: string): string | undefined {
  return customUserPasswords.get(identifier.toLowerCase());
}



const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
]);

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_DOC_SIZE = 15 * 1024 * 1024;


export function verifyFileSignature(buffer: Buffer, claimedMime: string): boolean {
  if (!buffer || buffer.length < 4) return false;

  const hexPrefix = buffer.slice(0, 12).toString('hex').toLowerCase();

  switch (claimedMime) {
    case 'image/jpeg':

      return hexPrefix.startsWith('ffd8ff');
    case 'image/png':

      return hexPrefix.startsWith('89504e470d0a1a0a');
    case 'image/webp':

      return hexPrefix.startsWith('52494646') && hexPrefix.includes('57454250');
    case 'application/pdf':

      return hexPrefix.startsWith('25504446');
    default:
      return false;
  }
}

export function validateUploadedFile(
  buffer: Buffer,
  declaredMime: string,
  targetFileName: string
): { isValid: boolean; safeFileName: string; error?: string } {

  if (!ALLOWED_MIME_TYPES.has(declaredMime)) {
    return {
      isValid: false,
      safeFileName: '',
      error: `Disallowed file MIME type: ${declaredMime}. Only JPEG, PNG, WebP, and PDF are permitted.`,
    };
  }


  const maxSize = declaredMime === 'application/pdf' ? MAX_DOC_SIZE : MAX_IMAGE_SIZE;
  if (buffer.length > maxSize) {
    return {
      isValid: false,
      safeFileName: '',
      error: `File size ${Math.round(buffer.length / 1024)}KB exceeds maximum permitted limit (${maxSize / (1024 * 1024)}MB).`,
    };
  }


  if (!verifyFileSignature(buffer, declaredMime)) {
    return {
      isValid: false,
      safeFileName: '',
      error: 'File signature (magic bytes) mismatch. The content does not match the declared file extension or MIME type.',
    };
  }


  let safeExt = '.bin';
  if (declaredMime === 'image/jpeg') safeExt = '.jpg';
  else if (declaredMime === 'image/png') safeExt = '.png';
  else if (declaredMime === 'image/webp') safeExt = '.webp';
  else if (declaredMime === 'application/pdf') safeExt = '.pdf';

  const safeFileName = `${crypto.randomUUID()}${safeExt}`;

  return { isValid: true, safeFileName };
}



export function verifyWebhookSignature(
  rawBody: Buffer,
  signatureHeader: string | undefined,
  secret: string = WEBHOOK_SECRET
): boolean {
  if (!signatureHeader || !rawBody) return false;

  try {
    const computedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    const expectedBuf = Buffer.from(computedSignature);
    const providedBuf = Buffer.from(signatureHeader.replace(/^sha256=/, ''));

    if (expectedBuf.length !== providedBuf.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuf, providedBuf);
  } catch {
    return false;
  }
}



export const LoginSchema = z.object({
  role: z.enum(['student', 'faculty', 'admin', 'staff', 'warden', 'guest']),
  identifier: z.string().min(1).max(100),
  password: z.string().max(200),
}).strict();

export const ForgotPasswordSchema = z.object({
  identifier: z.string().min(1).max(100),
}).strict();

export const ResetPasswordSchema = z.object({
  token: z.string().min(16).max(128),
  newPassword: z.string().min(6).max(128),
}).strict();

export const FileUploadSchema = z.object({
  path: z.string().optional(),
  base64Data: z.string().min(10),
  contentType: z.string().max(100),
  bucket: z.string().max(50).optional(),
}).strict();

export const GeminiChatSchema = z.object({
  message: z.string().min(1).max(5000),
  studentContext: z.record(z.string(), z.any()).optional(),
}).strict();
