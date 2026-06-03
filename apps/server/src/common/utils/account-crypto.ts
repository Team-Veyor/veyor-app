import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';

/**
 * 계좌번호 등 민감정보 암호화/마스킹 유틸 (AES-256-GCM).
 * 저장 시 암호화, 응답 시 평문은 마스킹만 노출한다.
 */
const ALGO = 'aes-256-gcm';

function keyFrom(secret: string): Buffer {
  return createHash('sha256').update(secret).digest();
}

/** 평문 → base64(iv|tag|ciphertext) */
export function encrypt(plain: string, secret: string): string {
  const key = keyFrom(secret);
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGO, key, iv);
  const enc = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString('base64');
}

/** base64(iv|tag|ciphertext) → 평문 */
export function decrypt(payload: string, secret: string): string {
  const key = keyFrom(secret);
  const raw = Buffer.from(payload, 'base64');
  const iv = raw.subarray(0, 12);
  const tag = raw.subarray(12, 28);
  const enc = raw.subarray(28);
  const decipher = createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(enc), decipher.final()]).toString('utf8');
}

/** 계좌번호 마스킹: 앞 4 + **** + 뒤 4 (짧으면 앞부분만 노출) */
export function maskAccountNo(plain: string): string {
  const digits = plain.replace(/\s|-/g, '');
  if (digits.length <= 8) {
    return `${digits.slice(0, 2)}****`;
  }
  return `${digits.slice(0, 4)}****${digits.slice(-4)}`;
}
