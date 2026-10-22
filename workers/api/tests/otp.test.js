import test from "node:test";
import assert from "node:assert/strict";

// Re-implement the pure logic or test regex to verify edge cases
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

function extractOtp(text, subject) {
  const combined = `${subject || ""}\n${text || ""}`;
  if (!combined.trim()) return null;

  const lines = combined.split(/\r?\n/);

  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    const hasKeyword = KEYWORDS.some((kw) => lowerLine.includes(kw));

    if (hasKeyword) {
      const formattedMatch = line.match(/(?:code|otp|adalah|is|:)\s*[:\s]*([0-9]{3,4}[-\s][0-9]{3,4})\b/i);
      if (formattedMatch) {
        return formattedMatch[1].replace(/[-\s]/g, "");
      }

      const digitMatch = line.match(/(?:code|otp|adalah|is|:)\s*[:\s]*([0-9]{4,8})\b/i);
      if (digitMatch) {
        return digitMatch[1];
      }

      const standalone = line.match(/\b([0-9]{4,8})\b/);
      if (standalone) {
        const val = parseInt(standalone[1], 10);
        if (standalone[1].length === 4 && val >= 1990 && val <= 2030) {
          // year
        } else {
          return standalone[1];
        }
      }
    }
  }

  for (const line of lines) {
    const trimmed = line.trim();
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

test("OTP Parser: extracts 6-digit code with English keyword", () => {
  const text = "Hello,\nYour verification code is: 839201.\nDo not share this code.";
  const otp = extractOtp(text, "Verify your account");
  assert.equal(otp, "839201");
});

test("OTP Parser: extracts Indonesian verification code", () => {
  const text = "Halo Syawal,\nKode verifikasi Anda adalah 594832.\nBerlaku 5 menit.";
  const otp = extractOtp(text, "Konfirmasi Pendaftaran");
  assert.equal(otp, "594832");
});

test("OTP Parser: extracts hyphenated 6-digit code", () => {
  const text = "Your one-time code is: 482-910";
  const otp = extractOtp(text);
  assert.equal(otp, "482910");
});

test("OTP Parser: does not mistake year 2026 for OTP", () => {
  const text = "Copyright 2026 Syawal Corp. All rights reserved.";
  const otp = extractOtp(text, "Newsletter");
  assert.equal(otp, null);
});
