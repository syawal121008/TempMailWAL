import React, { useState } from "react";
import {
  Inbox,
  RefreshCw,
  Star,
  Trash2,
  KeyRound,
  Check,
  Copy,
  Mail,
  Shield,
  Search,
} from "lucide-react";
import { MessageSummary } from "../types";

interface InboxListProps {
  messages: MessageSummary[];
  loading: boolean;
  refreshing: boolean;
  onSelectMessage: (message: MessageSummary) => void;
  onDeleteMessage: (messageId: string, e: React.MouseEvent) => void;
  onCopyOtp: (otp: string, e: React.MouseEvent) => void;
  onManualRefresh: () => void;
  copiedOtpId: string | null;
}

// Generate consistent avatar color based on sender name/email
const AVATAR_COLORS = [
  "bg-blue-600 text-white",
  "bg-emerald-600 text-white",
  "bg-orange-600 text-white",
  "bg-purple-600 text-white",
  "bg-rose-600 text-white",
  "bg-amber-600 text-white",
  "bg-teal-600 text-white",
  "bg-indigo-600 text-white",
];

function getAvatarProps(senderName: string, senderEmail: string) {
  const name = senderName || senderEmail || "User";
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % AVATAR_COLORS.length;
  return { initial, colorClass: AVATAR_COLORS[colorIndex] };
}

export const InboxList: React.FC<InboxListProps> = ({
  messages,
  loading,
  refreshing,
  onSelectMessage,
  onDeleteMessage,
  onCopyOtp,
  onManualRefresh,
  copiedOtpId,
}) => {
  const [starredIds, setStarredIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const toggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setStarredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (isToday) {
      return date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
  };

  const filteredMessages = messages.filter((m) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.sender.toLowerCase().includes(q) ||
      (m.from_name && m.from_name.toLowerCase().includes(q)) ||
      m.subject.toLowerCase().includes(q) ||
      m.summary.toLowerCase().includes(q) ||
      (m.extracted_otp && m.extracted_otp.includes(q))
    );
  });

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111622] shadow-xl shadow-slate-200/50 dark:shadow-black/40 overflow-hidden transition-colors">
      {/* 1. Gmail-like Top Toolbar */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 dark:bg-[#0c1017]">
        <div className="flex items-center gap-3">
          {/* Refresh icon button */}
          <button
            onClick={onManualRefresh}
            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            title="Refresh Kotak Masuk"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin text-orange-500" : ""}`}
            />
          </button>

          {/* Active Tab: "Utama" (Primary) */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold text-xs border-b-2 border-orange-500 text-orange-600 dark:text-orange-400 bg-orange-500/10">
            <Mail className="w-3.5 h-3.5" />
            <span>Utama</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-orange-500 text-white font-bold">
              {messages.length}
            </span>
          </div>

          {refreshing && (
            <span className="text-xs text-orange-600 dark:text-orange-400 font-medium flex items-center gap-1.5 animate-pulse hidden sm:flex">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              Sinkronisasi realtime...
            </span>
          )}
        </div>

        {/* Search input in toolbar */}
        {messages.length > 0 && (
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari email atau OTP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-orange-500 transition-colors w-40 sm:w-56"
            />
          </div>
        )}
      </div>

      {/* 2. Messages List or Empty State */}
      {messages.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center px-4">
          <div className="relative mb-5">
            <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/30">
              <Inbox className="w-8 h-8 text-orange-500" />
            </div>
            <div className="absolute inset-0 rounded-full border border-orange-500/30 animate-ping pointer-events-none" />
          </div>

          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg mb-1.5">
            Kotak Masuk Kosong
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
            Menunggu email masuk... Kirim email atau kode OTP dari Gmail Anda ke alamat di atas. Pesan akan langsung muncul seketika secara realtime!
          </p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="py-12 text-center text-sm text-slate-400">
          Tidak ada email yang cocok dengan pencarian "{searchQuery}"
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {filteredMessages.map((msg) => {
            const isUnread = !msg.is_read;
            const isStarred = starredIds.has(msg.id);
            const { initial, colorClass } = getAvatarProps(
              msg.from_name || "",
              msg.sender
            );

            return (
              <div
                key={msg.id}
                onClick={() => onSelectMessage(msg)}
                className={`group flex items-center gap-3 sm:gap-4 px-4 py-3.5 hover:bg-orange-50/50 dark:hover:bg-[#161d2d] cursor-pointer transition-all duration-150 ${
                  isUnread
                    ? "bg-white dark:bg-[#111726] font-semibold"
                    : "bg-slate-50/30 dark:bg-transparent opacity-90"
                }`}
              >
                {/* Star icon */}
                <button
                  onClick={(e) => toggleStar(msg.id, e)}
                  className="p-1 rounded text-slate-300 dark:text-slate-600 hover:text-amber-400 dark:hover:text-amber-400 transition-colors shrink-0"
                  title={isStarred ? "Hapus bintang" : "Beri bintang"}
                >
                  <Star
                    className={`w-4 h-4 ${
                      isStarred
                        ? "fill-amber-400 text-amber-400"
                        : "hover:fill-amber-400/30"
                    }`}
                  />
                </button>

                {/* Sender Avatar (Colored initial circle) */}
                <div
                  className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center text-xs font-bold shrink-0 shadow-sm`}
                >
                  {initial}
                </div>

                {/* Sender Name */}
                <div className="w-28 sm:w-44 shrink-0 truncate">
                  <span
                    className={`text-sm truncate block ${
                      isUnread
                        ? "font-bold text-slate-900 dark:text-white"
                        : "font-medium text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {msg.from_name || msg.sender.split("@")[0]}
                  </span>
                </div>

                {/* Subject & Snippet Preview (Gmail style) */}
                <div className="min-w-0 flex-1 flex items-center gap-1.5 truncate">
                  <span
                    className={`text-sm truncate ${
                      isUnread
                        ? "font-bold text-slate-900 dark:text-white"
                        : "font-normal text-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {msg.subject || "(Tanpa Subjek)"}
                  </span>
                  <span className="text-slate-400 dark:text-slate-600 hidden sm:inline">
                    -
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 truncate hidden sm:inline font-normal">
                    {msg.summary || "Tidak ada pratinjau teks"}
                  </span>
                </div>

                {/* OTP Quick Copy Badge (Vibrant Orange Pill) */}
                {msg.extracted_otp && (
                  <button
                    onClick={(e) => onCopyOtp(msg.extracted_otp!, e)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500 text-white hover:bg-orange-600 active:scale-95 text-xs font-mono font-bold transition-all shadow-sm shadow-orange-500/30 shrink-0"
                    title="Klik untuk salin kode OTP instan"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>OTP: {msg.extracted_otp}</span>
                    {copiedOtpId === msg.extracted_otp ? (
                      <Check className="w-3 h-3 text-white" />
                    ) : (
                      <Copy className="w-3 h-3 text-orange-200" />
                    )}
                  </button>
                )}

                {/* Timestamp & Hover Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-xs whitespace-nowrap ${
                      isUnread
                        ? "font-bold text-orange-600 dark:text-orange-400"
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {formatTime(msg.received_at)}
                  </span>

                  {/* Hover Delete Button */}
                  <button
                    onClick={(e) => onDeleteMessage(msg.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-md transition-all ml-1"
                    title="Hapus email ini"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
