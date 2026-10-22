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

async function safeFetch<T>(url: string, options: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, options);
  } catch (err) {
    throw new Error(
      "Tidak dapat terhubung ke server API. Pastikan Worker API sedang berjalan (npm run dev:api)."
    );
  }

  let json: any = null;
  const rawText = await res.text();
  try {
    json = rawText ? JSON.parse(rawText) : null;
  } catch {
    json = null;
  }

  if (!res.ok) {
    const errorMsg =
      json?.error ||
      (res.status === 404
        ? "API endpoint tidak ditemukan. Pastikan backend Worker API aktif di port 8787 (npm run dev:api)."
        : `Server merespon dengan status ${res.status}: ${res.statusText}`);
    throw new Error(errorMsg);
  }

  if (!json || !json.success) {
    throw new Error(json?.error || "Respon dari server tidak valid.");
  }

  return json.data as T;
}

export async function createInboxApi(expirationMinutes?: number): Promise<InboxSession> {
  return safeFetch<InboxSession>(`${API_BASE}/api/v1/inboxes`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ expiration_minutes: expirationMinutes || 10 }),
  });
}

export async function getMyInboxApi(token: string): Promise<InboxSession> {
  const data = await safeFetch<InboxSession>(`${API_BASE}/api/v1/inboxes/me`, {
    headers: getHeaders(token),
  });
  return { ...data, token };
}

export async function getMessagesApi(
  token: string,
  limit = 50,
  offset = 0
): Promise<{ messages: MessageSummary[]; total: number }> {
  return safeFetch<{ messages: MessageSummary[]; total: number }>(
    `${API_BASE}/api/v1/inboxes/me/messages?limit=${limit}&offset=${offset}`,
    {
      headers: getHeaders(token),
    }
  );
}

export async function getMessageDetailApi(
  token: string,
  messageId: string
): Promise<MessageDetail> {
  return safeFetch<MessageDetail>(
    `${API_BASE}/api/v1/inboxes/me/messages/${messageId}`,
    {
      headers: getHeaders(token),
    }
  );
}

export async function deleteMessageApi(
  token: string,
  messageId: string
): Promise<boolean> {
  try {
    await safeFetch(`${API_BASE}/api/v1/inboxes/me/messages/${messageId}`, {
      method: "DELETE",
      headers: getHeaders(token),
    });
    return true;
  } catch {
    return false;
  }
}

export async function deleteInboxApi(token: string): Promise<boolean> {
  try {
    await safeFetch(`${API_BASE}/api/v1/inboxes/me`, {
      method: "DELETE",
      headers: getHeaders(token),
    });
    return true;
  } catch {
    return false;
  }
}
