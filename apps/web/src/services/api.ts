import { InboxSession, MessageSummary, MessageDetail } from "../types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

function getHeaders(token?: string): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export async function createInboxApi(expirationMinutes?: number): Promise<InboxSession> {
  const res = await fetch(`${API_BASE}/api/v1/inboxes`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ expiration_minutes: expirationMinutes || 10 }),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || "Gagal membuat email sementara");
  }

  return json.data;
}

export async function getMyInboxApi(token: string): Promise<InboxSession> {
  const res = await fetch(`${API_BASE}/api/v1/inboxes/me`, {
    headers: getHeaders(token),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || "Gagal memuat status inbox");
  }

  return { ...json.data, token };
}

export async function getMessagesApi(
  token: string,
  limit = 50,
  offset = 0
): Promise<{ messages: MessageSummary[]; total: number }> {
  const res = await fetch(
    `${API_BASE}/api/v1/inboxes/me/messages?limit=${limit}&offset=${offset}`,
    {
      headers: getHeaders(token),
    }
  );

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || "Gagal mengambil pesan");
  }

  return json.data;
}

export async function getMessageDetailApi(
  token: string,
  messageId: string
): Promise<MessageDetail> {
  const res = await fetch(`${API_BASE}/api/v1/inboxes/me/messages/${messageId}`, {
    headers: getHeaders(token),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || "Gagal membaca detail pesan");
  }

  return json.data;
}

export async function deleteMessageApi(
  token: string,
  messageId: string
): Promise<boolean> {
  const res = await fetch(`${API_BASE}/api/v1/inboxes/me/messages/${messageId}`, {
    method: "DELETE",
    headers: getHeaders(token),
  });

  const json = await res.json();
  return res.ok && json.success;
}

export async function deleteInboxApi(token: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/api/v1/inboxes/me`, {
    method: "DELETE",
    headers: getHeaders(token),
  });

  const json = await res.json();
  return res.ok && json.success;
}
