import test from "node:test";
import assert from "node:assert/strict";

function sanitizeHtml(rawHtml) {
  if (!rawHtml) return "";
  let cleaned = rawHtml;
  cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  cleaned = cleaned.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");
  cleaned = cleaned.replace(/<\/?(iframe|object|embed|applet|frameset|frame|form|input|button)\b[^>]*>/gi, "");
  cleaned = cleaned.replace(/\s+on\w+\s*=\s*(["'][^"']*["']|[^\s>]+)/gi, "");
  cleaned = cleaned.replace(/(href|src)\s*=\s*["']\s*(javascript|vbscript|data):[^"']*["']/gi, '$1="#"');
  return cleaned.trim();
}

test("HTML Sanitizer: strips <script> and dangerous attributes", () => {
  const dirty = `<div>Hello <script>alert('XSS')</script><a href="javascript:alert(1)" onclick="steal()">Click me</a></div>`;
  const clean = sanitizeHtml(dirty);
  assert.ok(!clean.includes("<script>"));
  assert.ok(!clean.includes("alert('XSS')"));
  assert.ok(!clean.includes("onclick"));
  assert.ok(!clean.includes("javascript:"));
  assert.ok(clean.includes("Click me"));
});

test("HTML Sanitizer: removes iframes and embedded objects", () => {
  const dirty = `<iframe src="https://evil.com"></iframe><p>Legitimate text</p>`;
  const clean = sanitizeHtml(dirty);
  assert.ok(!clean.includes("<iframe"));
  assert.ok(clean.includes("Legitimate text"));
});
