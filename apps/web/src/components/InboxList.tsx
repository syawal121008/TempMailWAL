import React from "react";
import {
  Inbox as InboxIcon,
  Mail,
  Copy,
  Check,
  ChevronRight,
  KeyRound,
  Trash2,
} from "lucide-react";
import { MessageSummary } from "../types";

interface InboxListProps {
  messages: MessageSummary[];
  loading: boolean;
  refreshing: boolean;
  onSelectMessage: (message: MessageSummary) => void;
  onDeleteMessage: (messageId: string, e: React.MouseEvent) => void;
  onCopyOtp: (otp: string, e: React.MouseEvent) => void;
  copiedOtpId: string | null;
}

export const InboxList: React.FC<InboxListProps> = ({
  messages,
  loading,
  refreshing,
  onSelectMessage,
  onDeleteMessage,
  onCopyOtp,
  copiedOtpId,
}) => {
  const formatTime = (timestamp: number) => {
    const diffSeconds = Math.floor((Date.now() - timestamp) / 1000);
    if (diffSeconds < 60) return "Baru saja";
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m lalu`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}j lalu`;
    return new Date(timestamp).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col gap-4">
      {/* List Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <InboxIcon className="w-5 h-5 text-indigo-400" />
          <h2 className="font-semibold text-lg text-white">Kotak Masuk</h2>
          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            {messages.length} Pesan
          </span>
        </div>

        {refreshing && (
          <span className="text-xs text-indigo-400 flex items-center gap-1.5 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            Memeriksa email...
          </span>
        )}
      </div>

      {/* Messages List or Empty State */}
      {messages.length === 0 ? (
        <div className="py-14 flex flex-col items-center justify-center text-center px-4">
          {/* Radar / Pulsing Waiting Animation */}
          <div className="relative mb-5">
            <div className="w-16 h-16 rounded-full bg-indigo-600/10 flex items-center justify-center border border-indigo-500/20">
              <Mail className="w-7 h-7 text-indigo-400" />
            </div>
            <div className="absolute inset-0 rounded-full border border-indigo-500/30 animate-ping pointer-events-none" />
          </div>

          <h3 className="font-medium text-slate-200 text-base mb-1">
            Menunggu Email Masuk...
          </h3>
          <p className="text-sm text-slate-400 max-w-sm">
            Kirimkan email atau kode verifikasi ke alamat di atas. Pesan akan otomatis muncul di sini tanpa perlu reload halaman.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 divide-y divide-slate-800/40">
          {messages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => onSelectMessage(msg)}
              className="pt-2.5 first:pt-0 group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl hover:bg-slate-800/50 cursor-pointer border border-transparent hover:border-slate-700/50 transition-all duration-200"
            >
              {/* Left Column: Sender & Preview */}
              <div className="flex items-start gap-3 min-w-0 flex-1">
                {/* Status Dot */}
                <span
                  className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 ${
                    msg.is_read ? "bg-slate-600" : "bg-indigo-400 ring-4 ring-indigo-500/20"
                  }`}
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-slate-100 truncate">
                      {msg.from_name || msg.sender}
                    </span>
                    <span className="text-xs text-slate-500 hidden md:inline truncate">
                      &lt;{msg.sender}&gt;
                    </span>
                  </div>

                  <h4 className="font-semibold text-sm text-slate-200 group-hover:text-indigo-300 transition-colors truncate">
                    {msg.subject || "(Tanpa Subjek)"}
                  </h4>

                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                    {msg.summary || "Tidak ada cuplikan teks"}
                  </p>
                </div>
              </div>

              {/* Right Column: OTP badge, timestamp & actions */}
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                {/* Quick Copy OTP button if OTP is detected */}
                {msg.extracted_otp && (
                  <button
                    onClick={(e) => onCopyOtp(msg.extracted_otp!, e)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-semibold transition-colors"
                    title="Klik untuk salin kode OTP"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                    <span>OTP: {msg.extracted_otp}</span>
                    {copiedOtpId === msg.extracted_otp ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-indigo-400" />
                    )}
                  </button>
                )}

                <span className="text-xs text-slate-500 whitespace-nowrap">
                  {formatTime(msg.received_at)}
                </span>

                {/* Delete button */}
                <button
                  onClick={(e) => onDeleteMessage(msg.id, e)}
                  className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-700/50 transition-all"
                  title="Hapus pesan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
