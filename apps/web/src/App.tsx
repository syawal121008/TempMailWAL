import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { AddressCard } from "./components/AddressCard";
import { InboxList } from "./components/InboxList";
import { MessageModal } from "./components/MessageModal";
import { InfoSection } from "./components/InfoSection";
import { ToastContainer } from "./components/Toast";
import { useInbox } from "./hooks/useInbox";
import { MessageSummary, ToastMessage } from "./types";

export function App() {
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
  } = useInbox();

  const [selectedMessage, setSelectedMessage] = useState<MessageSummary | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [copiedOtpId, setCopiedOtpId] = useState<string | null>(null);

  // Auto-generate inbox on very first visit if no session exists and not loading
  useEffect(() => {
    if (!loading && !session && !error) {
      generateNewInbox(10).catch(() => {
        // Handled in useInbox
      });
    }
  }, [loading, session, error, generateNewInbox]);

  const addToast = (type: "success" | "error" | "info", text: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

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
      addToast("success", `Alamat baru berhasil dibuat: ${newSession.address}`);
    } catch {
      addToast("error", "Gagal membuat alamat baru");
    }
  };

  const handleDeleteInbox = async () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus inbox ini sekarang? Semua pesan akan dihapus permanen.")) {
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
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 selection:bg-indigo-600 selection:text-white">
      {/* Navigation Header */}
      <Header onScrollTo={scrollToSection} isConnected={!error} />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col gap-8">
        {/* Error notification if API failed */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => generateNewInbox(10)}
              className="text-xs bg-rose-500/20 hover:bg-rose-500/30 px-3 py-1.5 rounded-lg font-medium transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Hero & Address Box */}
        <section className="flex flex-col gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Kotak Masuk Sementara Anda
            </h1>
            <p className="text-sm text-slate-400">
              Gunakan email ini untuk menjaga privasi Anda dan menghindari spam yang tidak diinginkan.
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

        {/* Messages List */}
        <section>
          <InboxList
            messages={messages}
            loading={loading}
            refreshing={refreshing}
            onSelectMessage={(msg) => setSelectedMessage(msg)}
            onDeleteMessage={handleDeleteMessage}
            onCopyOtp={handleCopyOtp}
            copiedOtpId={copiedOtpId}
          />
        </section>

        {/* Explanatory Info & FAQ */}
        <InfoSection />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Syawal TempMail. All rights reserved.</p>
          <p className="font-mono text-[11px] text-slate-600">
            Powered by Cloudflare Workers & D1 Edge Database
          </p>
        </div>
      </footer>

      {/* Message Detail Modal */}
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

      {/* Toast Notification Container */}
      <ToastContainer
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />
    </div>
  );
}

export default App;
