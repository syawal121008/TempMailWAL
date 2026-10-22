-- Syawal TempMail D1 Database Migration: 0001_initial_schema.sql

-- 1. Inboxes Table
CREATE TABLE IF NOT EXISTS inboxes (
    id TEXT PRIMARY KEY,
    address TEXT UNIQUE NOT NULL,
    token_hash TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    expires_at INTEGER NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1
);

-- Inboxes Indexes
CREATE INDEX IF NOT EXISTS idx_inboxes_address ON inboxes(address);
CREATE INDEX IF NOT EXISTS idx_inboxes_expires_at ON inboxes(expires_at);
CREATE INDEX IF NOT EXISTS idx_inboxes_token_hash ON inboxes(token_hash);

-- 2. Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    inbox_id TEXT NOT NULL,
    message_id_header TEXT,
    sender TEXT NOT NULL,
    from_name TEXT,
    subject TEXT,
    summary TEXT,
    text_content TEXT,
    html_content TEXT,
    extracted_otp TEXT,
    size_bytes INTEGER NOT NULL DEFAULT 0,
    is_read INTEGER NOT NULL DEFAULT 0,
    received_at INTEGER NOT NULL,
    FOREIGN KEY (inbox_id) REFERENCES inboxes(id) ON DELETE CASCADE
);

-- Messages Indexes
CREATE INDEX IF NOT EXISTS idx_messages_inbox_id ON messages(inbox_id);
CREATE INDEX IF NOT EXISTS idx_messages_received_at ON messages(received_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_messages_inbox_header ON messages(inbox_id, message_id_header);
