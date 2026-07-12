import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

/**
 * Field-level AES-256-GCM encryption for health-related lead data at rest.
 *
 * Key: FIELD_ENCRYPTION_KEY env var — 32-byte key, base64-encoded.
 * Never commit the key; never expose it to the client.
 *
 * Ciphertext format: `enc:v1:<base64(iv || authTag || ciphertext)>`
 */

const PREFIX = "enc:v1:";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const KEY_LENGTH = 32;

function getEncryptionKey(): Buffer {
  const raw = process.env.FIELD_ENCRYPTION_KEY;
  if (!raw) {
    throw new Error(
      "FIELD_ENCRYPTION_KEY is not configured. Set a base64-encoded 32-byte key.",
    );
  }

  const key = Buffer.from(raw, "base64");
  if (key.length !== KEY_LENGTH) {
    throw new Error(
      `FIELD_ENCRYPTION_KEY must decode to ${KEY_LENGTH} bytes (got ${key.length}).`,
    );
  }

  return key;
}

export function isEncrypted(value: string): boolean {
  return value.startsWith(PREFIX);
}

export function encryptField(plaintext: string): string {
  const key = getEncryptionKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  const payload = Buffer.concat([iv, authTag, encrypted]);
  return `${PREFIX}${payload.toString("base64")}`;
}

export function decryptField(ciphertext: string): string {
  if (!isEncrypted(ciphertext)) {
    // Legacy plaintext rows (pre-encryption) — return as-is.
    return ciphertext;
  }

  const key = getEncryptionKey();
  const payload = Buffer.from(ciphertext.slice(PREFIX.length), "base64");
  const iv = payload.subarray(0, IV_LENGTH);
  const authTag = payload.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const encrypted = payload.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}

/** Encrypt if non-empty; return null for empty/undefined. */
export function encryptOptional(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  return encryptField(trimmed);
}

/** Decrypt if present; pass through null. */
export function decryptOptional(value: string | null | undefined): string | null {
  if (!value) return null;
  return decryptField(value);
}
