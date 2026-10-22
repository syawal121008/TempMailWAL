/**
 * OTP / Verification Code Extractor
 * Scans email text & subject for common OTP patterns and keywords.
 */

const KEYWORDS = [
  "verification code",
  "one-time password",
  "one-time code",
  "security code",
  "confirm your email",
  "confirmation code",
  "passcode",
  "otp",
  "kode verifikasi",
  "kode konfirmasi",
  "kode keamanan",
  "kode otp",
  "auth code",
  "login code",
  "pin",
];

export function extractOtp(text: string, subject?: string | null): string | null {
  const combined = `${subject || ""}\n${text || ""}`;
  if (!combined.trim()) return null;

  const lines = combined.split(/\r?\n/);

  // Strategy 1: Look for lines that explicitly contain our keywords
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    const hasKeyword = KEYWORDS.some((kw) => lowerLine.includes(kw));

    if (hasKeyword) {
      // Look for 4 to 8 digit numbers in this keyword line (or formatted as 123-456 / 123 456)
      // Example: "Your code is: 482910" -> "482910"
      // Example: "Kode verifikasi Anda adalah 593-102" -> "593102"
      const formattedMatch = line.match(/(?:code|otp|adalah|is|:)\s*[:\s]*([0-9]{3,4}[-\s][0-9]{3,4})\b/i);
      if (formattedMatch) {
        return formattedMatch[1].replace(/[-\s]/g, "");
      }

      const digitMatch = line.match(/(?:code|otp|adalah|is|:)\s*[:\s]*([0-9]{4,8})\b/i);
      if (digitMatch) {
        return digitMatch[1];
      }

      // Any standalone 4-8 digit number on this keyword line
      const standalone = line.match(/\b([0-9]{4,8})\b/);
      if (standalone) {
        // Exclude common 4-digit years like 2020-2030
        const val = parseInt(standalone[1], 10);
        if (standalone[1].length === 4 && val >= 1990 && val <= 2030) {
          // might be year, skip unless explicitly "code 2026"
        } else {
          return standalone[1];
        }
      }
    }
  }

  // Strategy 2: Look for prominent standalone blocks (e.g. big code in middle of email)
  for (const line of lines) {
    const trimmed = line.trim();
    // A single line consisting ONLY of a 4-8 digit code or separated code
    if (/^[0-9]{4,8}$/.test(trimmed)) {
      const val = parseInt(trimmed, 10);
      if (trimmed.length === 4 && val >= 1990 && val <= 2030) continue;
      return trimmed;
    }
    if (/^[0-9]{3,4}[-\s][0-9]{3,4}$/.test(trimmed)) {
      return trimmed.replace(/[-\s]/g, "");
    }
  }

  return null;
}
