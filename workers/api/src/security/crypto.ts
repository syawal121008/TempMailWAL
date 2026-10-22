/**
 * Cryptographic utility functions using Web Crypto API
 */

// Safe alphanumeric character set without ambiguous characters (e.g. no l vs 1, o vs 0 if desired, or standard lowercase alphanumeric)
const CHARSET = "abcdefghijklmnopqrstuvwxyz0123456789";

export function generateRandomString(length: number = 8): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let result = "";
  for (let i = 0; i < length; i++) {
    result += CHARSET[bytes[i] % CHARSET.length];
  }
  return result;
}

export function generateRandomAddress(domain: string = "syawaltzy.my.id"): string {
  const localPart = generateRandomString(8);
  return `${localPart}@${domain}`;
}

export function generateAccessToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function generateUUID(): string {
  return crypto.randomUUID();
}
