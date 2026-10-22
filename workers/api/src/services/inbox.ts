import { Env, Inbox } from "../types";
import { generateRandomAddress, generateAccessToken, hashToken, generateUUID } from "../security/crypto";

export async function createInbox(
  env: Env,
  requestedMinutes?: number
): Promise<{ inbox: Inbox; rawToken: string }> {
  const defaultMinutes = Number(env.DEFAULT_EXPIRATION_MINUTES) || 10;
  const maxMinutes = Number(env.MAX_EXPIRATION_MINUTES) || 60;
  const domain = env.EMAIL_DOMAIN || "syawaltzy.my.id";

  let durationMinutes = requestedMinutes ? Number(requestedMinutes) : defaultMinutes;
  if (isNaN(durationMinutes) || durationMinutes < 1) durationMinutes = defaultMinutes;
  if (durationMinutes > maxMinutes) durationMinutes = maxMinutes;

  const now = Date.now();
  const expiresAt = now + durationMinutes * 60 * 1000;
  const id = generateUUID();
  const rawToken = generateAccessToken();
  const tokenHash = await hashToken(rawToken);

  // Generate unique address with retry up to 3 times
  let address = "";
  for (let attempt = 0; attempt < 3; attempt++) {
    const candidate = generateRandomAddress(domain);
    const existing = await env.DB.prepare(
      "SELECT id FROM inboxes WHERE address = ?"
    )
      .bind(candidate)
      .first();

    if (!existing) {
      address = candidate;
      break;
    }
  }

  if (!address) {
    throw new Error("Gagal membuat alamat unik, silakan coba lagi.");
  }

  await env.DB.prepare(
    "INSERT INTO inboxes (id, address, token_hash, created_at, expires_at, is_active) VALUES (?, ?, ?, ?, ?, 1)"
  )
    .bind(id, address, tokenHash, now, expiresAt)
    .run();

  const inbox: Inbox = {
    id,
    address,
    token_hash: tokenHash,
    created_at: now,
    expires_at: expiresAt,
    is_active: 1,
  };

  return { inbox, rawToken };
}

export async function getInboxByTokenHash(
  env: Env,
  tokenHash: string
): Promise<Inbox | null> {
  const inbox = await env.DB.prepare(
    "SELECT id, address, token_hash, created_at, expires_at, is_active FROM inboxes WHERE token_hash = ? AND is_active = 1"
  )
    .bind(tokenHash)
    .first<Inbox>();

  if (!inbox) return null;

  // Check expiration
  if (inbox.expires_at < Date.now()) {
    // Mark inactive if expired
    await env.DB.prepare("UPDATE inboxes SET is_active = 0 WHERE id = ?")
      .bind(inbox.id)
      .run();
    return null;
  }

  return inbox;
}

export async function getInboxByAddress(
  env: Env,
  address: string
): Promise<Inbox | null> {
  const normalized = address.trim().toLowerCase();
  const inbox = await env.DB.prepare(
    "SELECT id, address, token_hash, created_at, expires_at, is_active FROM inboxes WHERE lower(address) = ? AND is_active = 1"
  )
    .bind(normalized)
    .first<Inbox>();

  if (!inbox) return null;

  if (inbox.expires_at < Date.now()) {
    await env.DB.prepare("UPDATE inboxes SET is_active = 0 WHERE id = ?")
      .bind(inbox.id)
      .run();
    return null;
  }

  return inbox;
}

export async function deleteInbox(env: Env, inboxId: string): Promise<boolean> {
  // Cascades to messages via SQLite foreign key or explicit deletion
  await env.DB.batch([
    env.DB.prepare("DELETE FROM messages WHERE inbox_id = ?").bind(inboxId),
    env.DB.prepare("DELETE FROM inboxes WHERE id = ?").bind(inboxId),
  ]);
  return true;
}

export async function cleanupExpiredData(env: Env): Promise<{ deletedInboxes: number; deletedMessages: number }> {
  const now = Date.now();

  // Find expired inbox IDs
  const expired = await env.DB.prepare(
    "SELECT id FROM inboxes WHERE expires_at < ? OR is_active = 0"
  )
    .bind(now)
    .all<{ id: string }>();

  if (!expired.results || expired.results.length === 0) {
    return { deletedInboxes: 0, deletedMessages: 0 };
  }

  const ids = expired.results.map((r) => r.id);
  // Batch delete in chunks of 50 to avoid parameter limits
  let totalDeletedInboxes = 0;
  let totalDeletedMessages = 0;

  for (let i = 0; i < ids.length; i += 50) {
    const chunk = ids.slice(i, i + 50);
    const placeholders = chunk.map(() => "?").join(",");

    const msgRes = await env.DB.prepare(
      `DELETE FROM messages WHERE inbox_id IN (${placeholders})`
    )
      .bind(...chunk)
      .run();

    const inboxRes = await env.DB.prepare(
      `DELETE FROM inboxes WHERE id IN (${placeholders})`
    )
      .bind(...chunk)
      .run();

    totalDeletedMessages += msgRes.meta.changes || 0;
    totalDeletedInboxes += inboxRes.meta.changes || 0;
  }

  return { deletedInboxes: totalDeletedInboxes, deletedMessages: totalDeletedMessages };
}
