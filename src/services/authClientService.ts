import { AuthSession } from '../types/erp';

export interface LoginResult {
  success: boolean;
  session?: AuthSession;
  error?: string;
  lockedUntil?: string;
  retryAfterSeconds?: number;
}

export interface PasswordResetResult {
  success: boolean;
  message: string;
  token?: string; // only provided in dev/testing environments if mock delivery
}

export const GUEST_SESSION: AuthSession = {
  role: 'guest',
  userId: 'GUEST-001',
  name: 'Public Visitor',
  email: 'visitor@mpdrec.ac.in',
};

class AuthClientService {
  /**
   * Fetches the server-verified session from httpOnly cookie.
   */
  async getSession(): Promise<AuthSession> {
    try {
      const resp = await fetch('/api/auth/session', {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        credentials: 'include', // Automatically sends httpOnly session cookie
      });

      if (resp.ok) {
        const data = await resp.json();
        if (data && data.session) {
          return data.session;
        }
      }
      return GUEST_SESSION;
    } catch {
      return GUEST_SESSION;
    }
  }

  /**
   * Submits credentials to the server endpoint for verification.
   * Server validates hash with bcrypt, checks rate limits/lockout, and issues httpOnly cookie.
   */
  async login(
    role: string,
    identifier: string,
    password: string
  ): Promise<LoginResult> {
    try {
      const resp = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          role,
          identifier: identifier.trim(),
          password: password.trim(),
        }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        return {
          success: false,
          error: data.error || 'Authentication failed. Please check your credentials.',
          lockedUntil: data.lockedUntil,
          retryAfterSeconds: data.retryAfterSeconds,
        };
      }

      return {
        success: true,
        session: data.session,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Network error occurred during login. Please try again.',
      };
    }
  }

  /**
   * Logs out user server-side, clearing the httpOnly session cookie.
   */
  async logout(): Promise<AuthSession> {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {}
    return GUEST_SESSION;
  }

  /**
   * Requests a single-use cryptographically random password reset token (15m expiry).
   */
  async requestPasswordReset(identifier: string): Promise<PasswordResetResult> {
    try {
      const resp = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim() }),
      });
      const data = await resp.json();
      return {
        success: resp.ok,
        message: data.message || (resp.ok ? 'Password reset token generated.' : data.error),
        token: data.debugToken,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Failed to process password reset request.',
      };
    }
  }

  /**
   * Resets password using the single-use token and bcrypt hashing.
   */
  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const resp = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token.trim(), newPassword }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        return { success: false, error: data.error || 'Failed to reset password.' };
      }
      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error resetting password.' };
    }
  }

  async resetPasswordWithToken(token: string, newPassword: string): Promise<{ success: boolean; message?: string; error?: string }> {
    return this.resetPassword(token, newPassword);
  }
}

export const authClientService = new AuthClientService();
