import { Env, Message } from "../types";
import { generateUUID } from "../security/crypto";

export async function getMessagesForInbox(
  env: Env,
  inboxId: string,
  limit: number = 50,
  offset: number = 0
): Promise<{ messages: Partial<Message>[]; total: number }> {
  // Query metadata for list (avoid transferring huge html_content over wire)
  const listQuery = env.DB.prepare(`
    SELECT id, inbox_id, sender, from_name, subject, summary, extracted_otp, size_bytes, is_read, received_at
    FROM messages
    WHERE inbox_id = ?
    ORDER BY received_at DESC
    LIMIT ? OFFSET ?
  `).bind(inboxId, limit, offset);

  const countQuery = env.DB.prepare(
    "SELECT COUNT(*) as total FROM messages WHERE inbox_id = ?"
  ).bind(inboxId);

  const [listResult, countResult] = await env.DB.batch([listQuery, countQuery]);

  const messages = (listResult.results as unknown as Partial<Message>[]) || [];
  const total = (countResult.results?.[0] as { total: number })?.total || 0;

  return { messages, total };
}

export async function getMessageById(
  env: Env,
  inboxId: string,
  messageId: string
): Promise<Message | null> {
  const message = await env.DB.prepare(`
    SELECT id, inbox_id, message_id_header, sender, from_name, subject, summary, text_content, html_content, extracted_otp, size_bytes, is_read, received_at
    FROM messages
    WHERE id = ? AND inbox_id = ?
  `)
    .bind(messageId, inboxId)
    .first<Message>();

  if (!message) return null;

  // Mark as read
  if (message.is_read === 0) {
    await env.DB.prepare("UPDATE messages SET is_read = 1 WHERE id = ?")
      .bind(messageId)
      .run();
    message.is_read = 1;
  }

  return message;
}

export async function deleteMessage(
  env: Env,
  inboxId: string,
  messageId: string
): Promise<boolean> {
  const res = await env.DB.prepare(
    "DELETE FROM messages WHERE id = ? AND inbox_id = ?"
  )
    .bind(messageId, inboxId)
    .run();

  return (res.meta.changes || 0) > 0;
}

export async function saveIncomingMessage(
  env: Env,
  params: {
    inboxId: string;
    messageIdHeader?: string | null;
    sender: string;
    fromName?: string | null;
    subject?: string | null;
    summary?: string | null;
    textContent?: string | null;
    htmlContent?: string | null;
    extractedOtp?: string | null;
    sizeBytes: number;
  }
): Promise<string> {
  const id = generateUUID();
  const receivedAt = Date.now();

  await env.DB.prepare(`
    INSERT INTO messages (
      id, inbox_id, message_id_header, sender, from_name, subject, summary,
      text_content, html_content, extracted_otp, size_bytes, is_read, received_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
  `)
    .bind(
      id,
      params.inboxId,
      params.messageIdHeader || null,
      params.sender,
      params.fromName || null,
      params.subject || "(No Subject)",
      params.summary || "",
      params.textContent || "",
      params.htmlContent || null,
      params.extractedOtp || null,
      params.sizeBytes || 0,
      receivedAt
    )
    .run();

  return id;
}
