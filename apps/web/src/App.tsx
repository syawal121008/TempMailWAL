import React, { useState, useEffect, useCallback } from "react";
import { Header } from "./components/Header";
import { AddressCard } from "./components/AddressCard";
import { InboxList } from "./components/InboxList";
import { MessageModal } from "./components/MessageModal";
import { InfoSection } from "./components/InfoSection";
import { ToastContainer } from "./components/Toast";
import { useInbox } from "./hooks/useInbox";
import { MessageSummary, ToastMessage } from "./types";
import { playNotificationChime } from "./lib/sound";
import { Heart, ExternalLink } from "lucide-react";

export function App() {
  // Theme state: dark or light
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : true; // Default dark
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<MessageSummary | null>(null);
  const [copiedOtpId, setCopiedOtpId] = useState<string | null>(null);

  // Sync theme with HTML class
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const addToast = useCallback((type: "success" | "error" | "info", text: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  // Callback when a brand new email arrives via real-time polling
  const handleNewMessage = useCallback(
    (msg: MessageSummary) => {
      playNotificationChime();
      addToast(
        "success",
        `Email baru masuk dari: ${msg.from_name || msg.sender}!`
      );
    },
    [addToast]
  );

  const {
    session,
    messages,
    loading,
    refreshing,
    error,
    generateNewInbox,
    deleteCurrentInbox,
    removeMessage,
    manualRefresh,
  } = useInbox({ onNewMessage: handleNewMessage });

  // Auto-generate on first visit
  useEffect(() => {
    if (!loading && !session && !error) {
      generateNewInbox(10).catch(() => {});
    }
  }, [loading, session, error, generateNewInbox]);

  const handleCopyAddress = (address: string) => {
    addToast("success", `Alamat ${address} berhasil disalin!`);
  };

  const handleCopyOtp = (otp: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(otp);
    setCopiedOtpId(otp);
    addToast("success", `Kode OTP ${otp} berhasil disalin!`);
    setTimeout(() => setCopiedOtpId(null), 2500);
  };

  const handleGenerate = async (durationMinutes?: number) => {
    try {
      const newSession = await generateNewInbox(durationMinutes);
      addToast("success", `Alamat baru dibuat: ${newSession.address}`);
    } catch {
      addToast("error", "Gagal membuat alamat baru");
    }
  };

  const handleDeleteInbox = async () => {
    if (
      window.confirm(
        "Apakah Anda yakin ingin menghapus inbox ini? Semua pesan akan dihapus permanen."
      )
    ) {
      await deleteCurrentInbox();
      addToast("info", "Inbox berhasil dihapus.");
    }
  };

  const handleRefresh = () => {
    manualRefresh();
    addToast("info", "Kotak masuk diperbarui.");
  };

  const handleDeleteMessage = (messageId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    removeMessage(messageId);
    addToast("info", "Pesan telah dihapus.");
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#080c14] text-slate-800 dark:text-slate-100 transition-colors duration-200 selection:bg-orange-500 selection:text-white">
      {/* Top Navbar */}
      <Header
        onScrollTo={scrollToSection}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        isConnected={!error}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 sm:py-10 flex flex-col gap-8">
        {/* Error notification */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => generateNewInbox(10)}
              className="text-xs bg-rose-500/20 hover:bg-rose-500/30 px-3 py-1.5 rounded-lg font-semibold transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Address Generator Card */}
        <section className="flex flex-col gap-3">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Kotak Masuk Sementara
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Gunakan email ini untuk menjaga privasi Anda dan menerima kode verifikasi secara realtime.
            </p>
          </div>

          <AddressCard
            session={session}
            loading={loading}
            refreshing={refreshing}
            onGenerate={handleGenerate}
            onRefresh={handleRefresh}
            onDelete={handleDeleteInbox}
            onCopyAddress={handleCopyAddress}
          />
        </section>

        {/* Gmail-Style Inbox List */}
        <section>
          <InboxList
            messages={messages}
            loading={loading}
            refreshing={refreshing}
            onSelectMessage={(msg) => setSelectedMessage(msg)}
            onDeleteMessage={handleDeleteMessage}
            onCopyOtp={handleCopyOtp}
            onManualRefresh={handleRefresh}
            copiedOtpId={copiedOtpId}
          />
        </section>

        {/* Informational & FAQ Section */}
        <InfoSection />
      </main>

      {/* Footer with personal branding syawaltzy.biz.id */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#060910] py-8 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span>© {new Date().getFullYear()} Syawal TempMail.</span>
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-orange-500 fill-orange-500 inline" />
            <span>untuk</span>
            <a
              href="https://syawaltzy.biz.id"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 dark:text-orange-400 font-semibold hover:underline inline-flex items-center gap-0.5"
            >
              syawaltzy.biz.id
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400 dark:text-slate-500 font-mono">
            <span>Domain: syawaltzy.my.id</span>
            <span>•</span>
            <span>Cloudflare Edge + D1</span>
          </div>
        </div>
      </footer>

      {/* Gmail-Style Email Reading Modal */}
      {selectedMessage && session && (
        <MessageModal
          messageSummary={selectedMessage}
          token={session.token}
          onClose={() => setSelectedMessage(null)}
          onDelete={(id) => handleDeleteMessage(id)}
          onCopyOtp={(otp) => handleCopyOtp(otp)}
          copiedOtpId={copiedOtpId}
        />
      )}

      {/* Floating Toast Notification Container */}
      <ToastContainer
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />
    </div>
  );
}

export default App;
