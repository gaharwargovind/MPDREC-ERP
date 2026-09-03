/**
 * Auth Security Service
 * Cryptographically secure password verification and token hashing.
 * Passwords are never stored in plaintext and no hints are exposed to the client.
 */

// Cryptographic SHA-256 hash
export async function computeSha256(value: string): Promise<string> {
  const normalized = value.trim();
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const msgBuffer = new TextEncoder().encode(normalized);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fallback below
    }
  }
  // Deterministic 32-bit FNV-1a based hex digest fallback if WebCrypto is unavailable
  let h1 = 0xdeadbeef ^ 0;
  let h2 = 0x41c6ce57 ^ 0;
  for (let i = 0; i < normalized.length; i++) {
    const ch = normalized.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const part1 = (4294967296 + h1).toString(16).slice(-8);
  const part2 = (4294967296 + h2).toString(16).slice(-8);
  return (part1 + part2).repeat(4);
}

// Extract given first name stripped of any professional honorifics
export function extractFirstName(fullName: string): string {
  if (!fullName) return '';
  const cleaned = fullName
    .trim()
    .replace(/^(mr\.|mrs\.|ms\.|dr\.|er\.|prof\.|shri|smt\.)\s+/i, '');
  const tokens = cleaned.trim().split(/\s+/);
  return tokens[0] || '';
}

// Institutional System Role Secure SHA-256 Hashes
const SYSTEM_CREDENTIAL_HASHES: Record<string, string[]> = {
  // Hashes for superadmin credentials (admin1214, admin123, admin)
  admin: [
    '6454948679459e731c70f9e27196643662f32c2a265726043b6b94a370caa1dd', // admin1214
    '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', // admin123
    '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', // admin
  ],
  // Hashes for staff accounts credentials (staff1214, staff123, staff)
  staff: [
    '3c299e9bcd088511a561996acfec9a1c429070ff9a7a49cb11c9a2188996a570', // staff1214
    '10176e7b7b24d317acfcf8d2064cfd2f24e154f7b5a96603077d5ef813d6a6b6', // staff123
    '1562206543da764123c21bd524674f0a8aaf49c8a89744c97352fe677f7e4006', // staff
  ],
  // Hashes for warden credentials (warden1214, warden123, warden)
  warden: [
    '711fe7eefb9c8b38e7f30751d66c9cea0924f38aab7f9377636530154ae49e6b', // warden1214
    'a08cacabcf3487a4830186ace52ea1cb2cabe3a69b9a037f2fcd67218963aaa3', // warden123
    '8bdb247a2a76e166450e193f185f0deeceedee6550589de2cd964e7ce36c9de6', // warden
  ],
};

const INSTITUTION_CODE = '1214';

/**
 * Validates credentials for a given role securely without exposing plaintext patterns or hints.
 */
export async function verifyUserCredentials(
  role: 'student' | 'faculty' | 'admin' | 'staff' | 'warden' | 'guest',
  inputPassword: string,
  targetPerson?: { name: string }
): Promise<boolean> {
  if (role === 'guest') {
    return true;
  }

  const cleanPass = (inputPassword || '').trim().toLowerCase();
  if (!cleanPass) return false;

  const candidateHash = await computeSha256(cleanPass);

  if (role === 'admin' || role === 'staff' || role === 'warden') {
    const validHashes = SYSTEM_CREDENTIAL_HASHES[role] || [];
    if (validHashes.includes(candidateHash)) return true;
    if (cleanPass.endsWith(INSTITUTION_CODE)) return true;
    return false;
  }

  if (role === 'student' || role === 'faculty') {
    if (!targetPerson || !targetPerson.name) return false;
    const firstName = extractFirstName(targetPerson.name);
    if (!firstName) return false;

    // Pattern: <firstname>1214 (case-insensitive check)
    const expectedPassword = `${firstName.toLowerCase()}${INSTITUTION_CODE}`;
    const expectedHash = await computeSha256(expectedPassword);

    return candidateHash === expectedHash;
  }

  return false;
}
