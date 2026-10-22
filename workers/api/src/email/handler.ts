import PostalMime from "postal-mime";
import { Env } from "../types";
import { getInboxByAddress } from "../services/inbox";
import { saveIncomingMessage } from "../services/message";
import { sanitizeHtml } from "../security/sanitizer";
import { extractOtp } from "../services/otp";

// Cloudflare Email Worker message interface
export interface ForwardableEmailMessage {
  readonly from: string;
  readonly to: string;
  readonly headers: Headers;
  readonly raw: ReadableStream<Uint8Array>;
  readonly rawSize: number;
  setReject(reason: string): void;
  forward(rcptTo: string, headers?: Headers): Promise<void>;
}

export async function handleIncomingEmail(
  message: ForwardableEmailMessage,
  env: Env
): Promise<void> {
  const maxSizeBytes = Number(env.MAX_EMAIL_SIZE_BYTES) || 5242880; // 5 MB

  // 1. Envelope check: Destination address
  const recipient = message.to.trim().toLowerCase();
  const sender = message.from.trim();

  // 2. Size limitation check
  if (message.rawSize > maxSizeBytes) {
    console.warn(`[Email Reject] Size ${message.rawSize} bytes exceeds limit ${maxSizeBytes}`);
    message.setReject("Message size exceeds maximum allowed limit");
    return;
  }

  // 3. Verify recipient inbox existence and validity
  const inbox = await getInboxByAddress(env, recipient);
  if (!inbox) {
    console.warn(`[Email Reject] Recipient inbox not found or expired: ${recipient}`);
    // Drop silently or setReject to prevent bounce spam
    message.setReject("Recipient inbox not found or has expired");
    return;
  }

  try {
    // 4. Read raw stream to ArrayBuffer for PostalMime
    const reader = message.raw.getReader();
    const chunks: Uint8Array[] = [];
    let receivedBytes = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        chunks.push(value);
        receivedBytes += value.length;
        if (receivedBytes > maxSizeBytes) {
          message.setReject("Message size exceeded during reading");
          return;
        }
      }
    }

    // Combine chunks
    const fullBuffer = new Uint8Array(receivedBytes);
    let offset = 0;
    for (const chunk of chunks) {
      fullBuffer.set(chunk, offset);
      offset += chunk.length;
    }

    // 5. Parse MIME
    const parser = new PostalMime();
    const parsed = await parser.parse(fullBuffer.buffer);

    const subject = parsed.subject || "(No Subject)";
    const textContent = parsed.text || "";
    const rawHtml = parsed.html || "";
    const sanitizedHtml = rawHtml ? sanitizeHtml(rawHtml) : null;
    const fromName = parsed.from?.name || null;
    const messageIdHeader = parsed.messageId || null;

    // Generate short text summary (max 160 chars)
    const plainForSummary = textContent || rawHtml.replace(/<[^>]+>/g, " ");
    const summary = plainForSummary.trim().replace(/\s+/g, " ").slice(0, 160);

    // 6. Extract OTP
    const extractedOtp = extractOtp(textContent, subject);

    // 7. Store in D1
    await saveIncomingMessage(env, {
      inboxId: inbox.id,
      messageIdHeader,
      sender: parsed.from?.address || sender,
      fromName,
      subject,
      summary,
      textContent,
      htmlContent: sanitizedHtml,
      extractedOtp,
      sizeBytes: receivedBytes,
    });

    console.log(`[Email Stored] Inbox: ${inbox.address}, Subject: "${subject}", Size: ${receivedBytes}B`);
  } catch (error) {
    console.error("[Email Parse Error]", error);
    // Don't leak internals, but don't crash Worker
  }
}
