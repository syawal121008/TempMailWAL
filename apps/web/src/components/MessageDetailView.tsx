import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Copy,
  Check,
  KeyRound,
  Trash2,
  FileText,
  Code,
} from "lucide-react";
import { MessageSummary, MessageDetail } from "../types";
import { getMessageDetailApi } from "../services/api";

interface MessageDetailViewProps {
  messageSummary: MessageSummary;
  token: string;
  onBack: () => void;
  onDelete: (messageId: string) => void;
  onCopyOtp: (otp: string) => void;
  copiedOtpId: string | null;
}

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

export const MessageDetailView: React.FC<MessageDetailViewProps> = ({
  messageSummary,
  token,
  onBack,
  onDelete,
  onCopyOtp,
  copiedOtpId,
}) => {
  const [detail, setDetail] = useState<MessageDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<"text" | "html">("text");

  useEffect(() => {
    let isMounted = true;
    getMessageDetailApi(token, messageSummary.id)
      .then((data) => {
        if (isMounted) {
          setDetail(data);
          if (!data.text_content && data.html_content) {
            setViewMode("html");
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error loading message detail", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [token, messageSummary.id]);

  const otp = detail?.extracted_otp || messageSummary.extracted_otp;
  const { initial, colorClass } = getAvatarProps(
    messageSummary.from_name || "",
    messageSummary.sender
  );

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111726] shadow-xl shadow-slate-200/50 dark:shadow-black/40 overflow-hidden transition-all duration-200 animate-in fade-in">
      {/* 1. Gmail-Style Top Action Bar */}
      <div className="px-4 sm:px-6 py-3 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/80 dark:bg-[#0c1017]">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors font-semibold text-xs sm:text-sm"
        >
          <ArrowLeft className="w-4 h-4 text-orange-500" />
          <span>Kembali ke Kotak Masuk</span>
        </button>

        <button
          onClick={() => onDelete(messageSummary.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-xs font-semibold"
          title="Hapus Email"
        >
          <Trash2 className="w-4 h-4" />
          <span>Hapus</span>
        </button>
      </div>

      {/* 2. Email Header */}
      <div className="p-6 sm:p-8 pb-4 border-b border-slate-200 dark:border-slate-800/80">
        {/* Subject Title */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 leading-snug">
          {messageSummary.subject || "(Tanpa Subjek)"}
        </h2>

        {/* Sender & Recipient Bar (Gmail style) */}
        <div className="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-3 min-w-0">
            {/* Colored Avatar */}
            <div
              className={`w-10 h-10 rounded-full ${colorClass} flex items-center justify-center font-bold text-sm shrink-0 shadow-sm`}
            >
              {initial}
            </div>

            <div className="min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  {messageSummary.from_name || messageSummary.sender}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  &lt;{messageSummary.sender}&gt;
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                kepada saya
              </p>
            </div>
          </div>

          <div className="text-right text-xs text-slate-500 dark:text-slate-400 shrink-0 self-end sm:self-center">
            {new Date(messageSummary.received_at).toLocaleString("id-ID", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </div>
        </div>
      </div>

      {/* 3. Prominent Orange OTP Highlight Banner if detected */}
      {otp && (
        <div className="bg-gradient-to-r from-orange-500/15 via-orange-500/10 to-transparent border-b border-orange-500/30 px-6 sm:px-8 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/25">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                Kode Verifikasi / OTP Terdeteksi
              </p>
              <span className="font-mono text-2xl font-black text-slate-900 dark:text-white tracking-widest">
                {otp}
              </span>
            </div>
          </div>

          <button
            onClick={() => onCopyOtp(otp)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-md shadow-orange-600/30 active:scale-95"
          >
            {copiedOtpId === otp ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Salin OTP</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* 4. View mode toggle (Plain text vs Formatted HTML) */}
      {detail?.html_content && (
        <div className="px-6 sm:px-8 py-2 bg-slate-50 dark:bg-[#0c1017] border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-end gap-2 text-xs">
          <span className="text-slate-500 mr-2">Tampilan:</span>
          <button
            onClick={() => setViewMode("text")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
              viewMode === "text"
                ? "bg-white dark:bg-slate-800 text-orange-600 dark:text-orange-400 shadow-sm font-semibold"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Teks Biasa
          </button>
          <button
            onClick={() => setViewMode("html")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
              viewMode === "html"
                ? "bg-white dark:bg-slate-800 text-orange-600 dark:text-orange-400 shadow-sm font-semibold"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            HTML Bersih
          </button>
        </div>
      )}

      {/* 5. Email Body Content */}
      <div className="p-6 sm:p-8 min-h-[220px] bg-white dark:bg-[#0e131f] text-slate-800 dark:text-slate-200">
        {loading ? (
          <div className="flex flex-col gap-3 animate-pulse">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
          </div>
        ) : viewMode === "text" || !detail?.html_content ? (
          <div className="whitespace-pre-wrap font-sans text-sm sm:text-base leading-relaxed select-text">
            {detail?.text_content || "Tidak ada konten teks yang dapat ditampilkan."}
          </div>
        ) : (
          <div
            className="prose dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: detail.html_content }}
          />
        )}
      </div>

      {/* 6. Bottom Navigation Bar */}
      <div className="p-4 sm:px-8 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-[#0c1017] flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali</span>
        </button>

        <button
          onClick={() => onDelete(messageSummary.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors font-semibold"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Hapus Email</span>
        </button>
      </div>
    </div>
  );
};
