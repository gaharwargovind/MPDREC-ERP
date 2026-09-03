/**
 * End-to-End Encryption (E2EE) Service for MPDREC Hub
 * Built on the Web Crypto API (window.crypto.subtle)
 *
 * Cryptographic Protocol:
 * - Key Exchange: ECDH (Elliptic Curve Diffie-Hellman) over NIST P-256
 * - Symmetric Message Encryption: AES-256-GCM (12-byte IV, 128-bit authentication tag)
 * - Group Encryption: Symmetrically encrypted with unique AES-256-GCM Group Key,
 *   asymmetrically wrapped (encrypted) per-member via ECDH key agreement.
 * - Key Persistence: Client-side storage in browser IndexedDB (fallback to localStorage/memory)
 * - Fingerprints: SHA-256 computed safety numbers for participant identity verification
 */

export interface UserKeyPairJWK {
  publicKey: JsonWebKey;
  privateKey: JsonWebKey;
}

export interface EncryptedPayload {
  ciphertext: string; // Base64
  iv: string; // Base64 (12 bytes)
  ephemeralPublicKey?: JsonWebKey; // For 1-on-1 ephemeral ECDH
  algorithm: 'AES-256-GCM';
  keyVersion?: number;
  timestamp: string;
}

export interface EncryptedGroupKeyPackage {
  wrappedKeyCiphertext: string; // Base64
  iv: string; // Base64
  ephemeralPublicKey: JsonWebKey;
  targetUserId: string;
}

// Helpers for Base64 <-> ArrayBuffer
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// IndexedDB Key Store for secure private key storage
class E2EEKeyStore {
  private dbName = 'mpdrec_e2ee_keystore_v1';
  private storeName = 'user_keys';
  private inMemoryFallback = new Map<string, UserKeyPairJWK>();

  private async openDB(): Promise<IDBDatabase | null> {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return null;
    }
    return new Promise((resolve) => {
      try {
        const request = window.indexedDB.open(this.dbName, 1);
        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains(this.storeName)) {
            db.createObjectStore(this.storeName, { keyPath: 'userId' });
          }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }

  async saveKeyPair(userId: string, keyPair: UserKeyPairJWK): Promise<void> {
    this.inMemoryFallback.set(userId, keyPair);
    try {
      localStorage.setItem(`mpdrec_e2ee_key_${userId}`, JSON.stringify(keyPair));
    } catch {
      // ignore
    }

    const db = await this.openDB();
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(this.storeName, 'readwrite');
        const store = tx.objectStore(this.storeName);
        store.put({ userId, ...keyPair });
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  async getKeyPair(userId: string): Promise<UserKeyPairJWK | null> {
    const memory = this.inMemoryFallback.get(userId);
    if (memory) return memory;

    try {
      const local = localStorage.getItem(`mpdrec_e2ee_key_${userId}`);
      if (local) {
        const parsed = JSON.parse(local) as UserKeyPairJWK;
        this.inMemoryFallback.set(userId, parsed);
        return parsed;
      }
    } catch {
      // ignore
    }

    const db = await this.openDB();
    if (!db) return null;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(this.storeName, 'readonly');
        const store = tx.objectStore(this.storeName);
        const req = store.get(userId);
        req.onsuccess = () => {
          if (req.result) {
            const data: UserKeyPairJWK = {
              publicKey: req.result.publicKey,
              privateKey: req.result.privateKey,
            };
            this.inMemoryFallback.set(userId, data);
            resolve(data);
          } else {
            resolve(null);
          }
        };
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }
}

const keyStore = new E2EEKeyStore();

export class E2EEService {
  private crypto: SubtleCrypto;
  private groupKeyCache = new Map<string, CryptoKey>(); // groupId -> CryptoKey

  constructor() {
    this.crypto = (typeof window !== 'undefined' && window.crypto && window.crypto.subtle)
      ? window.crypto.subtle
      : (null as any);
  }

  isSupported(): boolean {
    return typeof window !== 'undefined' && !!window.crypto && !!window.crypto.subtle;
  }

  /**
   * Initialize or retrieve user's ECDH keypair
   */
  async getOrCreateUserKeyPair(userId: string): Promise<{ publicKey: JsonWebKey; privateKey: JsonWebKey }> {
    if (!this.isSupported()) {
      throw new Error('Web Crypto API is not supported in this browser environment.');
    }

    const existing = await keyStore.getKeyPair(userId);
    if (existing && existing.publicKey && existing.privateKey) {
      return existing;
    }

    // Generate new ECDH P-256 keypair
    const keyPair = await this.crypto.generateKey(
      {
        name: 'ECDH',
        namedCurve: 'P-256',
      },
      true, // extractable
      ['deriveKey', 'deriveBits']
    );

    const [publicKeyJwk, privateKeyJwk] = await Promise.all([
      this.crypto.exportKey('jwk', keyPair.publicKey),
      this.crypto.exportKey('jwk', keyPair.privateKey),
    ]);

    const newKeyPair: UserKeyPairJWK = {
      publicKey: publicKeyJwk,
      privateKey: privateKeyJwk,
    };

    await keyStore.saveKeyPair(userId, newKeyPair);
    return newKeyPair;
  }

  /**
   * Import a public key JWK into a CryptoKey for ECDH
   */
  async importPublicKey(jwk: JsonWebKey): Promise<CryptoKey> {
    return this.crypto.importKey(
      'jwk',
      jwk,
      {
        name: 'ECDH',
        namedCurve: 'P-256',
      },
      true,
      []
    );
  }

  /**
   * Import a private key JWK into a CryptoKey for ECDH
   */
  async importPrivateKey(jwk: JsonWebKey): Promise<CryptoKey> {
    return this.crypto.importKey(
      'jwk',
      jwk,
      {
        name: 'ECDH',
        namedCurve: 'P-256',
      },
      true,
      ['deriveKey', 'deriveBits']
    );
  }

  /**
   * 1-on-1 Direct Messaging: Encrypt arbitrary payload using ECDH + AES-256-GCM
   * Uses an ephemeral ECDH keypair for Forward Secrecy per transmission
   */
  async encryptDirectMessage(
    recipientPublicKeyJwk: JsonWebKey,
    payload: any
  ): Promise<EncryptedPayload> {
    // 1. Generate ephemeral ECDH keypair
    const ephemeralKeyPair = await this.crypto.generateKey(
      { name: 'ECDH', namedCurve: 'P-256' },
      true,
      ['deriveKey']
    );

    // 2. Import recipient public key
    const recipientKey = await this.importPublicKey(recipientPublicKeyJwk);

    // 3. Derive symmetric AES-256-GCM session key
    const sessionKey = await this.crypto.deriveKey(
      {
        name: 'ECDH',
        public: recipientKey,
      },
      ephemeralKeyPair.privateKey,
      {
        name: 'AES-GCM',
        length: 256,
      },
      false,
      ['encrypt']
    );

    // 4. Encrypt payload
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const plaintextBytes = new TextEncoder().encode(JSON.stringify(payload));

    const ciphertextBuffer = await this.crypto.encrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      sessionKey,
      plaintextBytes
    );

    const ephemeralPublicKeyJwk = await this.crypto.exportKey('jwk', ephemeralKeyPair.publicKey);

    return {
      ciphertext: arrayBufferToBase64(ciphertextBuffer),
      iv: arrayBufferToBase64(iv.buffer),
      ephemeralPublicKey: ephemeralPublicKeyJwk,
      algorithm: 'AES-256-GCM',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 1-on-1 Direct Messaging: Decrypt message with recipient's private key
   */
  async decryptDirectMessage(
    recipientPrivateKeyJwk: JsonWebKey,
    encrypted: EncryptedPayload
  ): Promise<any> {
    if (!encrypted.ephemeralPublicKey) {
      throw new Error('Missing ephemeral public key in encrypted message payload.');
    }

    // 1. Import sender ephemeral public key
    const senderEphemeralKey = await this.importPublicKey(encrypted.ephemeralPublicKey);

    // 2. Import recipient private key
    const recipientPrivateKey = await this.importPrivateKey(recipientPrivateKeyJwk);

    // 3. Derive symmetric AES-256-GCM session key
    const sessionKey = await this.crypto.deriveKey(
      {
        name: 'ECDH',
        public: senderEphemeralKey,
      },
      recipientPrivateKey,
      {
        name: 'AES-GCM',
        length: 256,
      },
      false,
      ['decrypt']
    );

    // 4. Decrypt ciphertext
    const ivBuffer = base64ToArrayBuffer(encrypted.iv);
    const ciphertextBuffer = base64ToArrayBuffer(encrypted.ciphertext);

    const decryptedBuffer = await this.crypto.decrypt(
      {
        name: 'AES-GCM',
        iv: new Uint8Array(ivBuffer),
      },
      sessionKey,
      ciphertextBuffer
    );

    const decoded = new TextDecoder().decode(decryptedBuffer);
    return JSON.parse(decoded);
  }

  /**
   * Group Chats: Generate a fresh AES-256-GCM Group Key and wrap it for all members
   */
  async createGroupKeyPackages(
    memberPublicKeys: Record<string, JsonWebKey> // userId -> public JWK
  ): Promise<{
    rawGroupKeyBase64: string;
    packages: Record<string, EncryptedGroupKeyPackage>;
  }> {
    // 1. Generate symmetric Group Key
    const groupKey = await this.crypto.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );

    const rawKeyBuffer = await this.crypto.exportKey('raw', groupKey);
    const rawGroupKeyBase64 = arrayBufferToBase64(rawKeyBuffer);

    // 2. Wrap group key for each member
    const packages: Record<string, EncryptedGroupKeyPackage> = {};

    for (const [userId, pubJwk] of Object.entries(memberPublicKeys)) {
      if (!pubJwk) continue;
      const ephemeralKeyPair = await this.crypto.generateKey(
        { name: 'ECDH', namedCurve: 'P-256' },
        true,
        ['deriveKey']
      );

      const memberKey = await this.importPublicKey(pubJwk);
      const wrapKey = await this.crypto.deriveKey(
        { name: 'ECDH', public: memberKey },
        ephemeralKeyPair.privateKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt']
      );

      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const wrappedBuffer = await this.crypto.encrypt(
        { name: 'AES-GCM', iv },
        wrapKey,
        rawKeyBuffer
      );

      const ephemeralPubJwk = await this.crypto.exportKey('jwk', ephemeralKeyPair.publicKey);

      packages[userId] = {
        wrappedKeyCiphertext: arrayBufferToBase64(wrappedBuffer),
        iv: arrayBufferToBase64(iv.buffer),
        ephemeralPublicKey: ephemeralPubJwk,
        targetUserId: userId,
      };
    }

    return {
      rawGroupKeyBase64,
      packages,
    };
  }

  /**
   * Group Chats: Unwrap (decrypt) the member's group key package using their private key
   */
  async unwrapGroupKey(
    userId: string,
    userPrivateKeyJwk: JsonWebKey,
    pkg: EncryptedGroupKeyPackage
  ): Promise<CryptoKey> {
    const senderEphemeralKey = await this.importPublicKey(pkg.ephemeralPublicKey);
    const userPrivateKey = await this.importPrivateKey(userPrivateKeyJwk);

    const unwrapKey = await this.crypto.deriveKey(
      { name: 'ECDH', public: senderEphemeralKey },
      userPrivateKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );

    const ivBuffer = base64ToArrayBuffer(pkg.iv);
    const ciphertextBuffer = base64ToArrayBuffer(pkg.wrappedKeyCiphertext);

    const rawKeyBuffer = await this.crypto.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(ivBuffer) },
      unwrapKey,
      ciphertextBuffer
    );

    const groupKey = await this.crypto.importKey(
      'raw',
      rawKeyBuffer,
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt']
    );

    return groupKey;
  }

  /**
   * Encrypt a message using a Group Key
   */
  async encryptWithGroupKey(groupKey: CryptoKey, payload: any): Promise<EncryptedPayload> {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const plaintextBytes = new TextEncoder().encode(JSON.stringify(payload));

    const ciphertextBuffer = await this.crypto.encrypt(
      { name: 'AES-GCM', iv },
      groupKey,
      plaintextBytes
    );

    return {
      ciphertext: arrayBufferToBase64(ciphertextBuffer),
      iv: arrayBufferToBase64(iv.buffer),
      algorithm: 'AES-256-GCM',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Decrypt a message using a Group Key
   */
  async decryptWithGroupKey(groupKey: CryptoKey, encrypted: EncryptedPayload): Promise<any> {
    const ivBuffer = base64ToArrayBuffer(encrypted.iv);
    const ciphertextBuffer = base64ToArrayBuffer(encrypted.ciphertext);

    const decryptedBuffer = await this.crypto.decrypt(
      {
        name: 'AES-GCM',
        iv: new Uint8Array(ivBuffer),
      },
      groupKey,
      ciphertextBuffer
    );

    const decoded = new TextDecoder().decode(decryptedBuffer);
    return JSON.parse(decoded);
  }

  /**
   * Generate a human-verifiable 60-digit safety code / fingerprint
   * for peer-to-peer verification (e.g. Signal / WhatsApp style)
   */
  async computeSafetyNumber(keyA: JsonWebKey, keyB: JsonWebKey): Promise<{
    fingerprintString: string;
    blocks: string[];
    matrixCode: string;
  }> {
    const jsonA = JSON.stringify(keyA);
    const jsonB = JSON.stringify(keyB);
    const combined = [jsonA, jsonB].sort().join('::');

    const hashBuffer = await this.crypto.digest('SHA-256', new TextEncoder().encode(combined));
    const hashBytes = new Uint8Array(hashBuffer);

    // Convert to 12 numeric 5-digit blocks (60 digits total)
    const blocks: string[] = [];
    for (let i = 0; i < 12; i++) {
      const start = (i * 2) % hashBytes.length;
      const val = ((hashBytes[start] << 8) | hashBytes[(start + 1) % hashBytes.length]) % 100000;
      blocks.push(val.toString().padStart(5, '0'));
    }

    const fingerprintString = blocks.join(' ');
    const matrixCode = Array.from(hashBytes.slice(0, 16))
      .map(b => b.toString(16).padStart(2, '0').toUpperCase())
      .join(':');

    return {
      fingerprintString,
      blocks,
      matrixCode,
    };
  }

  /**
   * Helper: Encrypt Direct Message given sender and recipient user IDs
   */
  async encryptDirectMessageForUsers(
    senderUserId: string,
    recipientPublicKey: JsonWebKey,
    payload: any
  ): Promise<EncryptedPayload> {
    return this.encryptDirectMessage(recipientPublicKey, payload);
  }

  /**
   * Helper: Decrypt Direct Message for a recipient user ID
   */
  async decryptDirectMessageForUser(
    recipientUserId: string,
    encrypted: EncryptedPayload
  ): Promise<any> {
    const keyPair = await this.getOrCreateUserKeyPair(recipientUserId);
    return this.decryptDirectMessage(keyPair.privateKey, encrypted);
  }

  /**
   * Helper: Encrypt Group Message using unwrapped Group Key
   */
  async encryptGroupMessage(
    groupId: string,
    senderUserId: string,
    payload: any,
    groupKeyPackages: Record<string, EncryptedGroupKeyPackage>
  ): Promise<EncryptedPayload> {
    const senderKeyPair = await this.getOrCreateUserKeyPair(senderUserId);
    const userPkg = groupKeyPackages[senderUserId];
    if (!userPkg) {
      throw new Error(`Sender (${senderUserId}) is not in group key packages.`);
    }
    const groupKey = await this.unwrapGroupKey(senderUserId, senderKeyPair.privateKey, userPkg);
    return this.encryptWithGroupKey(groupKey, payload);
  }

  /**
   * Helper: Decrypt Group Message using unwrapped Group Key
   */
  async decryptGroupMessage(
    groupId: string,
    recipientUserId: string,
    encrypted: EncryptedPayload,
    groupKeyPackages: Record<string, EncryptedGroupKeyPackage>
  ): Promise<any> {
    const recipientKeyPair = await this.getOrCreateUserKeyPair(recipientUserId);
    const userPkg = groupKeyPackages[recipientUserId];
    if (!userPkg) {
      throw new Error(`Recipient (${recipientUserId}) is not in group key packages.`);
    }
    const groupKey = await this.unwrapGroupKey(recipientUserId, recipientKeyPair.privateKey, userPkg);
    return this.decryptWithGroupKey(groupKey, encrypted);
  }
}

export const e2eeService = new E2EEService();
