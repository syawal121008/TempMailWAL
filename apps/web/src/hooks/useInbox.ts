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

export function useInbox() {
  const [session, setSession] = useState<InboxSession | null>(null);
  const [messages, setMessages] = useState<MessageSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isTabVisibleRef = useRef(true);

  // Restore session from sessionStorage on initial load
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: InboxSession = JSON.parse(saved);
        if (parsed.expires_at > Date.now()) {
          setSession(parsed);
          // Verify with server
          getMyInboxApi(parsed.token)
            .then((verified) => {
              setSession(verified);
              sessionStorage.setItem(STORAGE_KEY, JSON.stringify(verified));
            })
            .catch(() => {
              // Expired or invalid on server
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
  const fetchMessages = useCallback(async (token: string, silent = false) => {
    if (!silent) setRefreshing(true);
    try {
      const data = await getMessagesApi(token);
      setMessages(data.messages);
      setError(null);
    } catch (err: unknown) {
      if (!silent) {
        setError(err instanceof Error ? err.message : "Gagal memuat pesan");
      }
    } finally {
      if (!silent) setRefreshing(false);
    }
  }, []);

  // Handle Visibility Change to conserve bandwidth and prevent aggressive polling
  useEffect(() => {
    const handleVisibilityChange = () => {
      isTabVisibleRef.current = document.visibilityState === "visible";
      // If returning to tab, immediately fetch
      if (isTabVisibleRef.current && session) {
        fetchMessages(session.token, true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [session, fetchMessages]);

  // Polling interval
  useEffect(() => {
    if (!session) return;

    // Fetch immediately on session start
    fetchMessages(session.token, true);

    const interval = setInterval(() => {
      // Only poll if tab is active and inbox not expired
      if (isTabVisibleRef.current && session.expires_at > Date.now()) {
        fetchMessages(session.token, true);
      }
    }, 5000); // Poll every 5s

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
      setLoading(false);
    }
  }, [session]);

  // Delete single message
  const removeMessage = useCallback(async (messageId: string) => {
    if (!session) return;
    const ok = await deleteMessageApi(session.token, messageId);
    if (ok) {
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    }
  }, [session]);

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
