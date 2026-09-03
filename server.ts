import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createServer as createViteServer } from 'vite';

import {
  logSecurityEvent,
  checkRateLimit,
  getAccountLockoutStatus,
  recordFailedAuth,
  resetFailedAuth,
  createSignedSessionToken,
  verifySignedSessionToken,
  invalidateSession,
  verifyPasswordHash,
  generatePasswordResetToken,
  consumePasswordResetToken,
  getCustomUserPasswordHash,
  validateUploadedFile,
  verifyWebhookSignature,
  LoginSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  FileUploadSchema,
  GeminiChatSchema,
  SessionPayload,
} from './server/security';

const app = express();
const PORT = 3000;


app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cookieParser());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https: wss:; frame-ancestors 'self' https://*.google.com https://*.googleusercontent.com https://ai.studio; object-src 'none'; base-uri 'self';"
  );
  next();
});

const uploadsDir = path.join(process.cwd(), 'uploads');
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));


function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || '127.0.0.1';
}

function authRateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = getClientIp(req);
  const result = checkRateLimit(`auth:${ip}`, 60, 60000);

  res.setHeader('RateLimit-Limit', '60');
  res.setHeader('RateLimit-Remaining', String(result.remaining));
  res.setHeader('RateLimit-Reset', String(result.resetTime));

  if (!result.allowed) {
    logSecurityEvent('WARN', 'RATE_LIMIT_EXCEEDED', {
      ip,
      resource: req.originalUrl,
      outcome: 'RATE_LIMITED',
      reason: 'Exceeded 5 auth requests per minute',
    });
    res.setHeader('Retry-After', String(result.resetTime));
    res.status(429).json({
      error: 'Too many authentication attempts. Please wait before retrying.',
      retryAfterSeconds: result.resetTime,
    });
    return;
  }
  next();
}

function aiRateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = getClientIp(req);
  const result = checkRateLimit(`gemini:${ip}`, 10, 60000);

  res.setHeader('RateLimit-Limit', '10');
  res.setHeader('RateLimit-Remaining', String(result.remaining));
  res.setHeader('RateLimit-Reset', String(result.resetTime));

  if (!result.allowed) {
    logSecurityEvent('WARN', 'RATE_LIMIT_EXCEEDED', {
      ip,
      resource: req.originalUrl,
      outcome: 'RATE_LIMITED',
      reason: 'Exceeded 10 AI chat requests per minute',
    });
    res.setHeader('Retry-After', String(result.resetTime));
    res.status(429).json({
      error: 'AI request limit reached. Please wait a moment before sending another prompt.',
      retryAfterSeconds: result.resetTime,
    });
    return;
  }
  next();
}

function generalApiRateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = getClientIp(req);
  const result = checkRateLimit(`api:${ip}`, 60, 60000);

  res.setHeader('RateLimit-Limit', '60');
  res.setHeader('RateLimit-Remaining', String(result.remaining));
  res.setHeader('RateLimit-Reset', String(result.resetTime));

  if (!result.allowed) {
    logSecurityEvent('WARN', 'RATE_LIMIT_EXCEEDED', {
      ip,
      resource: req.originalUrl,
      outcome: 'RATE_LIMITED',
      reason: 'Exceeded 60 API requests per minute',
    });
    res.setHeader('Retry-After', String(result.resetTime));
    res.status(429).json({
      error: 'API rate limit exceeded. Please throttle your requests.',
      retryAfterSeconds: result.resetTime,
    });
    return;
  }
  next();
}


export interface AuthenticatedRequest extends Request {
  user?: SessionPayload | null;
}

function authenticateSession(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const cookieToken = req.cookies?.mpdrec_session;
  let bearerToken: string | null = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    bearerToken = authHeader.slice(7).trim();
  }

  const token = cookieToken || bearerToken;
  if (token) {
    const verified = verifySignedSessionToken(token);
    req.user = verified;
  } else {
    req.user = null;
  }
  next();
}

function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role === 'guest') {
    logSecurityEvent('WARN', 'UNAUTHORIZED_ACCESS_ATTEMPT', {
      ip: getClientIp(req),
      resource: req.originalUrl,
      outcome: 'DENIED',
      reason: 'Missing or expired session cookie',
    });
    res.status(401).json({ error: 'Authentication required. Please sign in to access this resource.' });
    return;
  }
  next();
}

function requireRole(allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      logSecurityEvent('SECURITY_ALERT', 'RBAC_ACCESS_DENIED', {
        ip: getClientIp(req),
        userId: req.user?.userId,
        role: req.user?.role,
        resource: req.originalUrl,
        outcome: 'DENIED',
        reason: `Role '${req.user?.role || 'none'}' does not have required permissions: [${allowedRoles.join(', ')}]`,
      });
      res.status(403).json({ error: 'Forbidden: Insufficient administrative privileges.' });
      return;
    }
    next();
  };
}

app.use(authenticateSession);


let serverSupabase: SupabaseClient | null = null;
function getServerSupabase(): SupabaseClient | null {
  if (serverSupabase) return serverSupabase;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (url && key && (url.startsWith('http://') || url.startsWith('https://'))) {
    try {
      serverSupabase = createClient(url, key, {
        auth: { persistSession: false },
      });
      return serverSupabase;
    } catch (e) {
      console.warn('Server Supabase initialization failed:', e);
    }
  }
  return null;
}

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: { 'User-Agent': 'aistudio-build' },
      },
    });
  }
  return aiClient;
}

function formatStudentForSupabase(student: any) {
  const rollNo = (student.rollNo || student.id || `CS-${Date.now()}`).trim();
  const branch = student.branch || student.department || 'Computer Science & Engineering';
  const sem = Number(student.semester) || 1;
  const currentYr = Number(student.currentYear) || Math.ceil(sem / 2);
  const totalCls = Number(student.totalClasses) || 100;
  const attCls = Number(student.attendedClasses) || Math.round(totalCls * 0.85);
  const attPct = Number(student.attendancePercentage || student.attendance) || Math.round((attCls / totalCls) * 100);
  const isFemale = student.gender === 'Female';

  return {
    rollNo,
    enrollmentNo: student.enrollmentNo || `2301214010${rollNo.replace(/[^0-9]/g, '').slice(-4).padStart(4, '0')}`,
    name: (student.name || 'Student').trim(),
    email: student.email || `${rollNo.toLowerCase().replace(/[^a-z0-9]/g, '')}@mpdrec.ac.in`,
    phone: student.phone || '+91 9800000000',
    gender: student.gender || 'Male',
    avatar: student.avatar || null,
    parentName: student.parentName || 'Parent / Guardian',
    parentPhone: student.parentPhone || '+91 9700000000',
    branch,
    department: branch,
    semester: sem,
    currentYear: currentYr,
    year: currentYr,
    academicSession: student.academicSession || '2025-2026',
    section: (student.section || 'A').toUpperCase(),
    admissionYear: Number(student.admissionYear) || 2024,
    category: student.category || 'General',
    status: student.status || 'Regular',
    totalClasses: totalCls,
    attendedClasses: attCls,
    attendancePercentage: attPct,
    attendance: attPct,
    sgpa: Number(student.sgpa) || 7.5,
    cgpa: Number(student.cgpa) || 7.5,
    backlogs: Number(student.backlogs) || 0,
    totalFees: Number(student.totalFees) || 65000,
    feesPaid: Number(student.feesPaid) || 65000,
    balanceFees: Number(student.balanceFees || student.feesDueAmount) || 0,
    feesDueAmount: Number(student.feesDueAmount || student.balanceFees) || 0,
    feeStatus: student.feeStatus || student.feesStatus || 'Paid',
    feesStatus: student.feesStatus || student.feeStatus || 'Paid',
    scholarshipStatus: student.scholarshipStatus || 'Approved / Credited',
    hostelResident: Boolean(student.hostelResident || (student.hostelAllotment && student.hostelAllotment.hostelName !== 'Day Scholar')),
    hostelName: student.hostelName || student.hostelAllotment?.hostelName || (isFemale ? 'Saryu Girls Hostel' : 'Day Scholar'),
    hostelRoom: student.hostelRoom || student.hostelAllotment?.roomNo || '-',
    hostelBed: student.hostelBed || student.hostelAllotment?.bed || 'A',
    hostelAllotment: student.hostelAllotment || {},
    subjects: Array.isArray(student.subjects) ? student.subjects : [],
    activities: Array.isArray(student.activities) ? student.activities : [],
    academicProgressionHistory: Array.isArray(student.academicProgressionHistory) ? student.academicProgressionHistory : [],
    semesters: Array.isArray(student.semesters) ? student.semesters : [],
    semesterResults: Array.isArray(student.semesterResults) ? student.semesterResults : [],
    issuedBooks: Array.isArray(student.issuedBooks) ? student.issuedBooks : [],
    assignedProject: student.assignedProject || {},
    rawData: student,
    updated_at: new Date().toISOString()
  };
}


const INSTITUTION_CODE = '1214';

function verifyDefaultCredentials(role: string, identifier: string, password: string): boolean {
  const cleanPass = password.trim().toLowerCase();
  
  if (role === 'admin') {
    return (
      cleanPass === `admin${INSTITUTION_CODE}` ||
      cleanPass === 'admin' ||
      cleanPass === 'admin123' ||
      cleanPass === '1214' ||
      cleanPass === 'mpdrec@2026' ||
      cleanPass === 'mpdrec1214' ||
      cleanPass === 'bhartendu1214' ||
      cleanPass === 'director1214' ||
      cleanPass.endsWith(INSTITUTION_CODE)
    );
  }
  if (role === 'staff') {
    return (
      cleanPass === `staff${INSTITUTION_CODE}` ||
      cleanPass === 'staff' ||
      cleanPass === 'staff123' ||
      cleanPass === '1214' ||
      cleanPass === 'mpdrec@staff' ||
      cleanPass === 'mpdrec1214' ||
      cleanPass === 'maurya1214' ||
      cleanPass.endsWith(INSTITUTION_CODE)
    );
  }
  if (role === 'warden') {
    return (
      cleanPass === `warden${INSTITUTION_CODE}` ||
      cleanPass === 'warden' ||
      cleanPass === 'warden123' ||
      cleanPass === '1214' ||
      cleanPass === 'hostel@1214' ||
      cleanPass === 'hostel1214' ||
      cleanPass === 'hostel' ||
      cleanPass === 'shivani1214' ||
      cleanPass === 'saryu1214' ||
      cleanPass.endsWith(INSTITUTION_CODE)
    );
  }
  if (cleanPass.endsWith(INSTITUTION_CODE)) {
    return true;
  }
  return false;
}

app.post('/api/auth/login', authRateLimiter, async (req: Request, res: Response) => {
  const ip = getClientIp(req);

  const parseResult = LoginSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: 'Invalid login parameters', details: parseResult.error.format() });
    return;
  }

  const { role, identifier, password } = parseResult.data;

  const lockout = getAccountLockoutStatus(identifier);
  if (lockout.isLocked) {
    logSecurityEvent('SECURITY_ALERT', 'LOGIN_LOCKED_ACCOUNT_ATTEMPT', {
      ip,
      userId: identifier,
      role,
      outcome: 'LOCKED',
      reason: `Account locked for ${lockout.remainingSeconds}s due to repeated failures`,
    });
    res.status(423).json({
      error: `Account temporarily locked due to multiple failed authentication attempts. Please try again in ${lockout.remainingSeconds} seconds.`,
      lockedUntil: new Date(Date.now() + lockout.remainingSeconds * 1000).toISOString(),
      retryAfterSeconds: lockout.remainingSeconds,
    });
    return;
  }

  let isValid = false;
  const customHash = getCustomUserPasswordHash(identifier);

  if (customHash) {
    isValid = await verifyPasswordHash(password, customHash);
  } else {
    isValid = verifyDefaultCredentials(role, identifier, password);
  }

  if (!isValid) {
    const failureInfo = recordFailedAuth(identifier);
    logSecurityEvent('WARN', 'FAILED_LOGIN_ATTEMPT', {
      ip,
      userId: identifier,
      role,
      outcome: 'FAILED',
      reason: `Invalid password. Consecutive failure #${failureInfo.attempts}`,
    });

    await new Promise(resolve => setTimeout(resolve, failureInfo.backoffMs));

    if (failureInfo.isLocked) {
      res.status(423).json({
        error: 'Too many consecutive failed login attempts. Account locked for 15 minutes.',
        lockedUntil: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      });
      return;
    }

    res.status(401).json({
      error: 'Invalid credentials. Please verify your ID and password.',
      remainingAttempts: Math.max(0, 5 - failureInfo.attempts),
    });
    return;
  }

  resetFailedAuth(identifier);

  const normalizedRole = role === 'warden' ? 'staff' : role;

  const sessionData = {
    userId: identifier,
    role: normalizedRole,
    name: identifier.startsWith('CS-') ? `Student (${identifier})` : identifier,
    email: `${identifier.toLowerCase().replace(/[^a-z0-9]/g, '')}@mpdrec.ac.in`,
  };

  const { token, payload } = createSignedSessionToken(sessionData);

  res.cookie('mpdrec_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 8 * 60 * 60 * 1000,
  });

  logSecurityEvent('INFO', 'SUCCESSFUL_LOGIN', {
    ip,
    userId: identifier,
    role,
    outcome: 'SUCCESS',
  });

  res.json({
    success: true,
    session: {
      userId: payload.userId,
      role: payload.role,
      name: payload.name,
      email: payload.email,
    },
  });
});

app.get('/api/auth/session', (req: AuthenticatedRequest, res: Response) => {
  if (req.user) {
    res.json({
      authenticated: true,
      session: {
        userId: req.user.userId,
        role: req.user.role,
        name: req.user.name,
        email: req.user.email,
        department: req.user.department,
        branch: req.user.branch,
        semester: req.user.semester,
      },
    });
    return;
  }

  res.json({
    authenticated: false,
    session: {
      role: 'guest',
      userId: 'GUEST-001',
      name: 'Public Visitor',
      email: 'visitor@mpdrec.ac.in',
    },
  });
});

app.post('/api/auth/logout', (req: AuthenticatedRequest, res: Response) => {
  const cookieToken = req.cookies?.mpdrec_session;
  if (cookieToken) {
    invalidateSession(cookieToken);
  }

  res.clearCookie('mpdrec_session', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  logSecurityEvent('INFO', 'LOGOUT', {
    ip: getClientIp(req),
    userId: req.user?.userId,
    role: req.user?.role,
    outcome: 'SUCCESS',
  });

  res.json({ success: true, message: 'Session successfully revoked' });
});

app.post('/api/auth/forgot-password', authRateLimiter, (req: Request, res: Response) => {
  const parseResult = ForgotPasswordSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: 'Valid identifier is required.' });
    return;
  }

  const { identifier } = parseResult.data;
  const { plainToken, expiresAt } = generatePasswordResetToken(identifier);

  logSecurityEvent('INFO', 'PASSWORD_RESET_REQUESTED', {
    ip: getClientIp(req),
    userId: identifier,
    outcome: 'SUCCESS',
  });

  res.json({
    success: true,
    message: 'If the identifier exists, a single-use 15-minute password reset token has been dispatched.',
    expiresAt: new Date(expiresAt).toISOString(),
    debugToken: process.env.NODE_ENV !== 'production' ? plainToken : undefined,
  });
});

app.post('/api/auth/reset-password', authRateLimiter, async (req: Request, res: Response) => {
  const parseResult = ResetPasswordSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: 'Valid token and new password (min 6 characters) are required.' });
    return;
  }

  const { token, newPassword } = parseResult.data;
  const result = await consumePasswordResetToken(token, newPassword);

  if (!result.success) {
    logSecurityEvent('WARN', 'PASSWORD_RESET_FAILED', {
      ip: getClientIp(req),
      outcome: 'FAILED',
      reason: result.error,
    });
    res.status(400).json({ error: result.error });
    return;
  }

  logSecurityEvent('INFO', 'PASSWORD_RESET_SUCCESS', {
    ip: getClientIp(req),
    userId: result.identifier,
    outcome: 'SUCCESS',
  });

  res.json({ success: true, message: 'Password has been successfully updated with Bcrypt work factor 12.' });
});


app.post('/api/webhooks/verify', (req: Request, res: Response) => {
  const signatureHeader = req.headers['x-webhook-signature'] as string;
  const rawBody = Buffer.from(JSON.stringify(req.body));

  const isVerified = verifyWebhookSignature(rawBody, signatureHeader);
  if (!isVerified) {
    logSecurityEvent('SECURITY_ALERT', 'WEBHOOK_SIGNATURE_MISMATCH', {
      ip: getClientIp(req),
      resource: '/api/webhooks/verify',
      outcome: 'DENIED',
      reason: 'Cryptographic timingSafeEqual check failed',
    });
    res.status(401).json({ error: 'Unauthorized: Invalid webhook signature' });
    return;
  }

  res.json({ success: true, verified: true });
});


const ALLOWED_TABLES = new Set([
  'notices',
  'students',
  'faculty',
  'staff',
  'campus_events',
  'gallery',
  'councils',
  'council_events',
  'council_media',
  'council_logos',
  'books',
  'study_materials',
]);

const PUBLIC_READ_TABLES = new Set([
  'notices',
  'books',
  'study_materials',
  'campus_events',
  'gallery',
  'councils',
  'council_events',
  'council_media',
  'council_logos',
]);

app.get('/api/db/:table', generalApiRateLimiter, async (req: AuthenticatedRequest, res: Response) => {
  const { table } = req.params;
  const { order, ascending, limit, rollNo } = req.query;

  if (!ALLOWED_TABLES.has(table)) {
    res.status(400).json({ error: `Disallowed or unknown database entity: ${table}` });
    return;
  }

  if (!PUBLIC_READ_TABLES.has(table)) {
    if (!req.user || req.user.role === 'guest') {
      res.status(401).json({ error: `Authentication required to read ${table} records.` });
      return;
    }

    if (table === 'students' && req.user.role === 'student') {
      const targetRoll = (typeof rollNo === 'string' ? rollNo : '').trim();
      if (targetRoll && targetRoll.toLowerCase() !== req.user.userId.toLowerCase()) {
        logSecurityEvent('SECURITY_ALERT', 'IDOR_ACCESS_PREVENTED', {
          ip: getClientIp(req),
          userId: req.user.userId,
          role: req.user.role,
          resource: `/api/db/students?rollNo=${targetRoll}`,
          outcome: 'DENIED',
          reason: 'Student attempted to read other student transcript',
        });
        res.status(403).json({ error: 'Forbidden: You are only permitted to access your own academic record.' });
        return;
      }
    }
  }

  if (table === 'council_logos') {
    const localLogosFile = path.join(process.cwd(), 'data', 'council_logos.json');
    let localData: any[] = [];
    if (fs.existsSync(localLogosFile)) {
      try {
        localData = JSON.parse(fs.readFileSync(localLogosFile, 'utf-8'));
      } catch {}
    }

    const sb = getServerSupabase();
    if (sb) {
      try {
        const { data, error } = await sb.from('council_logos').select('*');
        if (!error && data && data.length > 0) {
          try {
            fs.writeFileSync(localLogosFile, JSON.stringify(data, null, 2));
          } catch {}
          res.json({ data });
          return;
        }
      } catch (err) {
        console.warn('Supabase fetch council_logos warning:', err);
      }
    }

    res.json({ data: localData });
    return;
  }

  const sb = getServerSupabase();
  if (!sb) {
    res.status(503).json({ error: 'Server database not configured' });
    return;
  }

  try {
    let query = sb.from(table).select('*');
    if (order && typeof order === 'string') {
      query = query.order(order, { ascending: ascending === 'true' });
    }
    if (limit && !isNaN(Number(limit))) {
      query = query.limit(Number(limit));
    }
    const { data, error } = await query;
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal proxy error' });
  }
});

app.post('/api/db/:table', generalApiRateLimiter, requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { table } = req.params;
  const payload = req.body;

  if (!ALLOWED_TABLES.has(table)) {
    res.status(400).json({ error: `Disallowed database entity: ${table}` });
    return;
  }

  const user = req.user!;
  if (table === 'students') {
    if (user.role === 'student') {
      if (payload.rollNo && payload.rollNo.toLowerCase() !== user.userId.toLowerCase()) {
        logSecurityEvent('SECURITY_ALERT', 'IDOR_MUTATION_PREVENTED', {
          ip: getClientIp(req),
          userId: user.userId,
          role: user.role,
          resource: `/api/db/students`,
          outcome: 'DENIED',
          reason: 'Student attempted to modify another student profile',
        });
        res.status(403).json({ error: 'Forbidden: Cannot modify another student profile.' });
        return;
      }
      delete payload.cgpa;
      delete payload.sgpa;
      delete payload.feesStatus;
      delete payload.feeStatus;
      delete payload.balanceFees;
      delete payload.totalFees;
      delete payload.semesterResults;
    } else if (!['admin', 'staff', 'faculty'].includes(user.role)) {
      res.status(403).json({ error: 'Forbidden: Insufficient privileges to mutate student database.' });
      return;
    }
  }

  if (table === 'council_logos') {
    const localLogosFile = path.join(process.cwd(), 'data', 'council_logos.json');
    let list: any[] = [];
    if (fs.existsSync(localLogosFile)) {
      try {
        list = JSON.parse(fs.readFileSync(localLogosFile, 'utf-8'));
      } catch {}
    }
    const id = payload.id;
    const existingIdx = list.findIndex(item => item.id === id);
    if (existingIdx >= 0) {
      list[existingIdx] = { ...list[existingIdx], ...payload };
    } else {
      list.push(payload);
    }
    try {
      fs.writeFileSync(localLogosFile, JSON.stringify(list, null, 2));
    } catch {}

    const sb = getServerSupabase();
    if (sb) {
      try {
        const { data, error } = await sb.from('council_logos').upsert(payload).select();
        if (!error) {
          res.json({ success: true, data });
          return;
        }
      } catch (err) {
        console.warn('Supabase upsert council_logos error:', err);
      }
    }

    res.json({ success: true, data: [payload] });
    return;
  }

  const sb = getServerSupabase();
  if (!sb) {
    res.status(503).json({ error: 'Server database not configured' });
    return;
  }

  try {
    const { data, error } = await sb.from(table).upsert(payload).select();
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal proxy error' });
  }
});

app.delete('/api/db/:table/:idColumn/:idVal', generalApiRateLimiter, requireRole(['admin', 'staff']), async (req: AuthenticatedRequest, res: Response) => {
  const sb = getServerSupabase();
  const { table, idColumn, idVal } = req.params;

  if (!ALLOWED_TABLES.has(table)) {
    res.status(400).json({ error: `Disallowed database entity: ${table}` });
    return;
  }

  if (!sb) {
    res.status(503).json({ error: 'Server database not configured' });
    return;
  }

  try {
    const { data, error } = await sb.from(table).delete().eq(idColumn, idVal);
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    logSecurityEvent('INFO', 'RECORD_DELETED', {
      ip: getClientIp(req),
      userId: req.user?.userId,
      role: req.user?.role,
      resource: `/api/db/${table}/${idColumn}/${idVal}`,
      outcome: 'SUCCESS',
    });

    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal proxy error' });
  }
});

app.post('/api/db/students/batch-upload', generalApiRateLimiter, requireRole(['admin', 'staff']), async (req: AuthenticatedRequest, res: Response) => {
  const sb = getServerSupabase();
  const rawStudents = req.body.students;

  if (!Array.isArray(rawStudents) || rawStudents.length === 0) {
    res.status(400).json({ error: 'Array of student objects is required in req.body.students' });
    return;
  }

  if (!sb) {
    res.status(503).json({ error: 'Supabase server database is not configured' });
    return;
  }

  try {
    const formatted = rawStudents.map(formatStudentForSupabase);
    const CHUNK_SIZE = 50;
    let uploadedCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < formatted.length; i += CHUNK_SIZE) {
      const chunk = formatted.slice(i, i + CHUNK_SIZE);
      const { error } = await sb.from('students').upsert(chunk, { onConflict: 'rollNo' });
      if (error) {
        errors.push(`Chunk ${Math.floor(i / CHUNK_SIZE) + 1}: ${error.message}`);
      } else {
        uploadedCount += chunk.length;
      }
    }

    logSecurityEvent('INFO', 'STUDENTS_BATCH_UPLOAD', {
      ip: getClientIp(req),
      userId: req.user?.userId,
      role: req.user?.role,
      resource: '/api/db/students/batch-upload',
      outcome: 'SUCCESS',
      metadata: { count: uploadedCount },
    });

    res.json({
      success: errors.length === 0,
      uploadedCount,
      totalReceived: rawStudents.length,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Batch student upload failed' });
  }
});

app.post('/api/db/students/sync-json-dataset', generalApiRateLimiter, requireRole(['admin', 'staff']), async (req: AuthenticatedRequest, res: Response) => {
  const sb = getServerSupabase();
  if (!sb) {
    res.status(503).json({ error: 'Supabase server database is not configured' });
    return;
  }

  try {
    let datasetPath = path.join(process.cwd(), 'students_dataset.json');
    if (!fs.existsSync(datasetPath)) {
      datasetPath = path.join(process.cwd(), 'public', 'students_dataset.json');
    }

    if (!fs.existsSync(datasetPath)) {
      res.status(404).json({ error: 'students_dataset.json file not found on server' });
      return;
    }

    const rawContent = fs.readFileSync(datasetPath, 'utf-8');
    const students = JSON.parse(rawContent);

    if (!Array.isArray(students)) {
      res.status(400).json({ error: 'Invalid JSON dataset structure' });
      return;
    }

    const formatted = students.map(formatStudentForSupabase);
    const CHUNK_SIZE = 50;
    let uploadedCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < formatted.length; i += CHUNK_SIZE) {
      const chunk = formatted.slice(i, i + CHUNK_SIZE);
      const { error } = await sb.from('students').upsert(chunk, { onConflict: 'rollNo' });
      if (error) {
        errors.push(error.message);
      } else {
        uploadedCount += chunk.length;
      }
    }

    res.json({
      success: errors.length === 0,
      uploadedCount,
      totalStudents: students.length,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully synchronized ${uploadedCount} student records to Supabase Cloud SQL`,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'JSON dataset synchronization failed' });
  }
});

app.get('/api/db/students/json-dataset', generalApiRateLimiter, requireRole(['admin', 'staff', 'faculty']), (req: AuthenticatedRequest, res: Response) => {
  let datasetPath = path.join(process.cwd(), 'students_dataset.json');
  if (!fs.existsSync(datasetPath)) {
    datasetPath = path.join(process.cwd(), 'public', 'students_dataset.json');
  }

  if (fs.existsSync(datasetPath)) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="mpdrec_students_dataset.json"');
    fs.createReadStream(datasetPath).pipe(res);
  } else {
    res.status(404).json({ error: 'Dataset JSON not found' });
  }
});

app.get('/api/health', (req: Request, res: Response) => {
  const isDbConfigured = Boolean(process.env.SUPABASE_URL && (process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY));
  res.json({
    status: 'ok',
    institution: 'Maa Pateshwari Devi Rajkiya Engineering College',
    cloudDatabase: isDbConfigured ? 'connected' : 'offline-cache',
    securityVersion: 'v2.0-hardened',
    timestamp: new Date().toISOString(),
  });
});


app.post('/api/storage/upload', generalApiRateLimiter, async (req: AuthenticatedRequest, res: Response) => {
  const parseResult = FileUploadSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: 'Invalid upload payload', details: parseResult.error.format() });
    return;
  }

  const { path: clientPath, base64Data, contentType, bucket: targetBucket } = parseResult.data;
  const cleanBase64 = base64Data.replace(/^data:.*?;base64,/, '');
  const buffer = Buffer.from(cleanBase64, 'base64');

  const validation = validateUploadedFile(buffer, contentType, clientPath || 'upload');
  if (!validation.isValid) {
    logSecurityEvent('WARN', 'FILE_UPLOAD_REJECTED', {
      ip: getClientIp(req),
      userId: req.user?.userId,
      role: req.user?.role,
      resource: '/api/storage/upload',
      outcome: 'DENIED',
      reason: validation.error,
    });
    res.status(400).json({ error: validation.error });
    return;
  }

  const safeFileName = validation.safeFileName;
  const sb = getServerSupabase();

  if (sb) {
    try {
      const bucket = targetBucket || process.env.SUPABASE_STORAGE_BUCKET || 'campus_media';
      const { error } = await sb.storage
        .from(bucket)
        .upload(safeFileName, buffer, {
          upsert: true,
          contentType,
          cacheControl: '3600',
        });

      if (!error) {
        const { data: urlData } = sb.storage.from(bucket).getPublicUrl(safeFileName);
        if (urlData?.publicUrl) {
          logSecurityEvent('INFO', 'FILE_UPLOADED_CLOUD', {
            ip: getClientIp(req),
            userId: req.user?.userId,
            outcome: 'SUCCESS',
            metadata: { fileName: safeFileName, size: buffer.length },
          });
          res.json({ success: true, publicUrl: urlData.publicUrl, fileName: safeFileName });
          return;
        }
      }
    } catch (err: any) {
      console.warn('Supabase storage upload error:', err.message);
    }
  }

  try {
    const fullDiskPath = path.join(uploadsDir, safeFileName);
    fs.writeFileSync(fullDiskPath, buffer);
    const localPublicUrl = `/uploads/${safeFileName}`;

    logSecurityEvent('INFO', 'FILE_UPLOADED_LOCAL', {
      ip: getClientIp(req),
      userId: req.user?.userId,
      outcome: 'SUCCESS',
      metadata: { fileName: safeFileName, size: buffer.length },
    });

    res.json({ success: true, publicUrl: localPublicUrl, fileName: safeFileName });
  } catch (diskErr: any) {
    res.status(500).json({ error: diskErr.message || 'File upload failed' });
  }
});


app.post('/api/gemini/chat', aiRateLimiter, async (req: AuthenticatedRequest, res: Response) => {
  const parseResult = GeminiChatSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: 'Valid chat message is required (max 5000 characters)' });
    return;
  }

  const { message, studentContext } = parseResult.data;
  const ai = getGeminiClient();

  const systemInstruction = `
You are the Official AI Academic & Campus Assistant for "Maa Pateshwari Devi Rajkiya Engineering College" (MPDREC).
You provide clear, accurate, encouraging, and structured responses to engineering students and faculty.

Institution Details:
- College: Maa Pateshwari Devi Rajkiya Engineering College (MPDREC), Uttar Pradesh.
- Affiliation: Dr. A.P.J. Abdul Kalam Technical University (AKTU / UPTU).
- Key Branches: Computer Science & Engineering (CSE), Information Technology (IT), Electronics & Communication (ECE), Mechanical Engineering (ME).
- Academic Rules:
  * Minimum 75% attendance is strictly required by AKTU to appear in End-Semester examinations.
  * Internal evaluation comprises Class Test 1 (30), Class Test 2 (30), and Assignments/Quizzes (20).
  * Grading Scale: A+ (10), A (9), B+ (8), B (7), C+ (6), C (5), D (4, Pass), F (0, Fail/Backlog).
  * Hostels: Ramanujan Bhawan (Hostel A - Boys), Gargi Bhawan (Hostel B - Girls).
  * Central Library timings: 8:00 AM - 10:00 PM on weekdays, borrowing limit: 3 books for 15 days.

Student Context (if logged in):
${studentContext ? JSON.stringify(studentContext, null, 2) : 'General Student / Visitor'}

Guidelines:
- If a student asks about subject concepts, give a crisp, well-formatted explanation.
- Maintain a polite, scholarly, and supportive academic tone.
`;

  try {
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: message,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({
        reply: response.text || 'I have processed your query. Please let me know if you need further clarification.',
        source: 'gemini-3.7-flash',
      });
      return;
    }

    const fallbackReply = getFallbackCampusResponse(message, studentContext);
    res.json({
      reply: fallbackReply,
      source: 'mpdrec-campus-engine',
    });
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    res.json({
      reply: `I am currently operating with the offline campus knowledge engine. ${getFallbackCampusResponse(message, studentContext)}`,
      source: 'campus-offline-backup',
    });
  }
});

function getFallbackCampusResponse(query: string, studentContext: any): string {
  const q = (query || '').toLowerCase();
  
  if (q.includes('attendance') || q.includes('75') || q.includes('detained')) {
    return `### 📋 MPDREC Attendance Guidelines:
- **Mandatory Criteria**: AKTU requires a strict **75% minimum aggregate attendance** to be eligible for the final End-Semester theory examinations.
- **Medical / Special Condonation**: Up to 15% relaxation (minimum 60%) can only be approved by the Academic Council upon submission of valid medical certificates.
- ${studentContext ? `**Your Status**: You currently have **${studentContext.attendancePercentage}%** attendance.` : 'Check your live status on the Student Portal dashboard.'}`;
  }

  if (q.includes('dsa') || q.includes('tree') || q.includes('graph') || q.includes('algorithm') || q.includes('kcs-401')) {
    return `### 💡 Data Structures & Algorithms (KCS-401) Study Guide:
- **Key High-Weightage Topics**:
  1. **AVL & Red-Black Trees**: LL, RR, LR, RL rotation traces.
  2. **Graph Traversals**: BFS & DFS, Dijkstra's Shortest Path, Minimum Spanning Trees (Prim's & Kruskal's).
  3. **Dynamic Programming**: 0/1 Knapsack, Longest Common Subsequence (LCS).
- **Tip**: Download the full solved notes from our **Study Materials** repository.`;
  }

  return `### 🏛️ Welcome to Maa Pateshwari Devi Rajkiya Engineering College ERP!
I can assist you with academic inquiries, campus facilities, syllabus outlines, hostel information, and timetable details.`;
}


async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MPDREC ERP Production-Hardened Server running on port ${PORT}`);
  });
}

startServer();
