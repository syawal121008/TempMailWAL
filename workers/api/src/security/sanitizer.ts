/**
 * HTML Sanitizer for incoming emails to prevent Stored XSS
 */

export function sanitizeHtml(rawHtml: string): string {
  if (!rawHtml) return "";

  let cleaned = rawHtml;

  // 1. Remove script tags and their content
  cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

  // 2. Remove style tags and their content (to prevent CSS injection/clickjacking)
  cleaned = cleaned.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");

  // 3. Remove iframe, object, embed, applet, frame, frameset, form, input, button
  cleaned = cleaned.replace(/<\/?(iframe|object|embed|applet|frameset|frame|form|input|button)\b[^>]*>/gi, "");

  // 4. Strip on* event attributes (onclick, onload, onerror, onmouseover, etc.)
  cleaned = cleaned.replace(/\s+on\w+\s*=\s*(["'][^"']*["']|[^\s>]+)/gi, "");

  // 5. Neutralize dangerous URL schemes in href/src
  cleaned = cleaned.replace(/(href|src)\s*=\s*["']\s*(javascript|vbscript|data):[^"']*["']/gi, '$1="#"');

  // 6. Set external links to open in a new tab with noopener noreferrer
  cleaned = cleaned.replace(/<a\b([^>]*?)>/gi, (match, attrs) => {
    if (!/target\s*=/i.test(attrs)) {
      attrs += ' target="_blank"';
    } else {
      attrs = attrs.replace(/target\s*=\s*["'][^"']*["']/i, 'target="_blank"');
    }
    if (!/rel\s*=/i.test(attrs)) {
      attrs += ' rel="noopener noreferrer nofollow"';
    } else {
      attrs = attrs.replace(/rel\s*=\s*["'][^"']*["']/i, 'rel="noopener noreferrer nofollow"');
    }
    return `<a${attrs}>`;
  });

  return cleaned.trim();
}
