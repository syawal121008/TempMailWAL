import React, { useState, useEffect, useCallback } from "react";
import { Header } from "./components/Header";
import { AddressCard } from "./components/AddressCard";
import { InboxList } from "./components/InboxList";
import { MessageModal } from "./components/MessageModal";
import { InfoSection } from "./components/InfoSection";
import { useInbox } from "./hooks/useInbox";
import { MessageSummary } from "./types";
import { playNotificationChime } from "./lib/sound";
import { showToast, showConfirmDialog, showAlert } from "./lib/swal";
import { Heart, ExternalLink } from "lucide-react";

export function App() {
  // Theme state: dark or light
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : true;
  });

  const [selectedMessage, setSelectedMessage] = useState<MessageSummary | null>(null);
  const [copiedOtpId, setCopiedOtpId] = useState<string | null>(null);

  // Sync theme with HTML root class
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

  // Real-time notification when a new email arrives
  const handleNewMessage = useCallback((msg: MessageSummary) => {
    playNotificationChime();
    showToast(
      "success",
      `Email baru dari: ${msg.from_name || msg.sender}`
    );
  }, []);

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
    showToast("success", `Alamat ${address} berhasil disalin!`);
  };

  const handleCopyOtp = (otp: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(otp);
    setCopiedOtpId(otp);
    showToast("success", `Kode OTP ${otp} berhasil disalin!`);
    setTimeout(() => setCopiedOtpId(null), 2500);
  };

  const handleGenerate = async (durationMinutes?: number) => {
    try {
      const newSession = await generateNewInbox(durationMinutes);
      showToast("success", `Alamat baru dibuat: ${newSession.address}`);
    } catch {
      showAlert("Gagal Membuat Alamat", "Terjadi kendala saat membuat alamat baru.", "error");
    }
  };

  const handleDeleteInbox = async () => {
    const confirmed = await showConfirmDialog(
      "Hapus Kotak Masuk?",
      "Semua email di kotak masuk ini akan langsung dihapus.",
      "Ya, Hapus",
      "Batal",
      true
    );

    if (confirmed) {
      await deleteCurrentInbox();
      showToast("info", "Kotak masuk telah dihapus.");
    }
  };

  const handleRefresh = () => {
    manualRefresh();
    showToast("info", "Kotak masuk diperbarui.");
  };

  const handleDeleteMessage = async (messageId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const confirmed = await showConfirmDialog(
      "Hapus Pesan?",
      "Pesan ini akan dihapus.",
      "Hapus",
      "Batal",
      true
    );

    if (confirmed) {
      removeMessage(messageId);
      showToast("info", "Pesan telah dihapus.");
    }
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

      {/* Main Content Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 sm:py-10 flex flex-col gap-8">
        {/* Error notification banner if API down */}
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
              Gunakan email ini untuk terima pesan atau kode verifikasi tanpa ribet.
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

        {/* Informational Section */}
        <InfoSection />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#060910] py-6 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="font-bold text-slate-800 dark:text-slate-200">TempMailWAL</span>
            <span>•</span>
            <span className="font-semibold text-orange-600 dark:text-orange-400">Powered By SyawalTzy</span>
            <span>•</span>
            <a
              href="https://syawaltzy.biz.id"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline inline-flex items-center gap-0.5 text-slate-600 dark:text-slate-300"
            >
              syawaltzy.biz.id
              <ExternalLink className="w-3 h-3 text-orange-500" />
            </a>
          </div>

          <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
            syawaltzy.my.id
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
    </div>
  );
}

export default App;
