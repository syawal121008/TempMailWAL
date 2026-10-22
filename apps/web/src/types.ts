export interface InboxSession {
  id: string;
  address: string;
  token: string;
  expires_at: number;
  created_at: number;
}

export interface MessageSummary {
  id: string;
  inbox_id: string;
  sender: string;
  from_name?: string | null;
  subject: string;
  summary: string;
  extracted_otp?: string | null;
  received_at: number;
  is_read: number;
  size_bytes: number;
}

export interface MessageDetail extends MessageSummary {
  message_id_header?: string | null;
  text_content?: string | null;
  html_content?: string | null;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  text: string;
}
