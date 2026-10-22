export interface Env {
  DB: D1Database;
  ALLOWED_ORIGIN?: string;
  DEFAULT_EXPIRATION_MINUTES?: string | number;
  MAX_EXPIRATION_MINUTES?: string | number;
  EMAIL_DOMAIN?: string;
  MAX_EMAIL_SIZE_BYTES?: string | number;
}

export interface Inbox {
  id: string;
  address: string;
  token_hash: string;
  created_at: number;
  expires_at: number;
  is_active: number;
}

export interface Message {
  id: string;
  inbox_id: string;
  message_id_header?: string | null;
  sender: string;
  from_name?: string | null;
  subject?: string | null;
  summary?: string | null;
  text_content?: string | null;
  html_content?: string | null;
  extracted_otp?: string | null;
  size_bytes: number;
  is_read: number;
  received_at: number;
}

export interface CreateInboxResponse {
  success: boolean;
  data: {
    id: string;
    address: string;
    token: string; // Plain token returned ONLY once at creation
    expires_at: number;
    created_at: number;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
