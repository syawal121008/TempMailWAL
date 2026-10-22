import { useState, useEffect, useCallback, useRef } from "react";
import { InboxSession, MessageSummary } from "../types";
import {
  createInboxApi,
  getMyInboxApi,
  getMessagesApi,
  deleteInboxApi,
  deleteMessageApi,
} from "../services/api";

const STORAGE_KEY = "syawal_tempmail_session";

interface UseInboxOptions {
  onNewMessage?: (msg: MessageSummary) => void;
}

export function useInbox(options?: UseInboxOptions) {
  const [session, setSession] = useState<InboxSession | null>(null);
  const [messages, setMessages] = useState<MessageSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isTabVisibleRef = useRef(true);
  const knownMessageIdsRef = useRef<Set<string>>(new Set());
  const isInitialFetchRef = useRef(true);

  // Restore session from sessionStorage on initial load
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: InboxSession = JSON.parse(saved);
        if (parsed.expires_at > Date.now()) {
          setSession(parsed);
          getMyInboxApi(parsed.token)
            .then((verified) => {
              setSession(verified);
              sessionStorage.setItem(STORAGE_KEY, JSON.stringify(verified));
            })
            .catch(() => {
              sessionStorage.removeItem(STORAGE_KEY);
              setSession(null);
            });
        } else {
          sessionStorage.removeItem(STORAGE_KEY);
        }
      } catch {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  // Fetch messages helper
  const fetchMessages = useCallback(
    async (token: string, silent = false) => {
      if (!silent) setRefreshing(true);
      try {
        const data = await getMessagesApi(token);
        const incomingMessages = data.messages;

        // Check if there are newly received emails (not present in known set)
        if (!isInitialFetchRef.current && options?.onNewMessage) {
          for (const msg of incomingMessages) {
            if (!knownMessageIdsRef.current.has(msg.id)) {
              options.onNewMessage(msg);
              break; // Trigger notification
            }
          }
        }

        // Update known IDs
        incomingMessages.forEach((m) => knownMessageIdsRef.current.add(m.id));
        isInitialFetchRef.current = false;

        setMessages(incomingMessages);
        setError(null);
      } catch (err: unknown) {
        if (!silent) {
          setError(err instanceof Error ? err.message : "Gagal memuat pesan");
        }
      } finally {
        if (!silent) setRefreshing(false);
      }
    },
    [options]
  );

  // Handle Visibility Change
  useEffect(() => {
    const handleVisibilityChange = () => {
      isTabVisibleRef.current = document.visibilityState === "visible";
      if (isTabVisibleRef.current && session) {
        fetchMessages(session.token, true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [session, fetchMessages]);

  // Realtime Polling Interval: 2.5 seconds
  useEffect(() => {
    if (!session) return;

    // Reset known IDs when session changes
    knownMessageIdsRef.current.clear();
    isInitialFetchRef.current = true;

    fetchMessages(session.token, true);

    const interval = setInterval(() => {
      if (isTabVisibleRef.current && session.expires_at > Date.now()) {
        fetchMessages(session.token, true);
      }
    }, 2500); // Snappy real-time polling every 2.5s

    return () => clearInterval(interval);
  }, [session, fetchMessages]);

  // Generate new inbox
  const generateNewInbox = useCallback(async (durationMinutes = 10) => {
    setLoading(true);
    setError(null);
    try {
      const newSession = await createInboxApi(durationMinutes);
      setSession(newSession);
      setMessages([]);
      knownMessageIdsRef.current.clear();
      isInitialFetchRef.current = true;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
      return newSession;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal membuat email");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete current inbox
  const deleteCurrentInbox = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    try {
      await deleteInboxApi(session.token);
    } catch (err) {
      console.warn("Error deleting remote inbox", err);
    } finally {
      sessionStorage.removeItem(STORAGE_KEY);
      setSession(null);
      setMessages([]);
      knownMessageIdsRef.current.clear();
      setLoading(false);
    }
  }, [session]);

  // Delete single message
  const removeMessage = useCallback(
    async (messageId: string) => {
      if (!session) return;
      const ok = await deleteMessageApi(session.token, messageId);
      if (ok) {
        setMessages((prev) => prev.filter((m) => m.id !== messageId));
        knownMessageIdsRef.current.delete(messageId);
      }
    },
    [session]
  );

  // Manual refresh
  const manualRefresh = useCallback(() => {
    if (session) {
      fetchMessages(session.token, false);
    }
  }, [session, fetchMessages]);

  return {
    session,
    messages,
    loading,
    refreshing,
    error,
    generateNewInbox,
    deleteCurrentInbox,
    removeMessage,
    manualRefresh,
  };
}
