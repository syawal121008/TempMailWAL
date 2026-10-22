import React, { useState, useEffect } from "react";
import {
  X,
  Copy,
  Check,
  KeyRound,
  Trash2,
  Calendar,
  User,
  Mail,
  Code,
  FileText,
} from "lucide-react";
import { MessageSummary, MessageDetail } from "../types";
import { getMessageDetailApi } from "../services/api";

interface MessageModalProps {
  messageSummary: MessageSummary;
  token: string;
  onClose: () => void;
  onDelete: (messageId: string) => void;
  onCopyOtp: (otp: string) => void;
  copiedOtpId: string | null;
}

export const MessageModal: React.FC<MessageModalProps> = ({
  messageSummary,
  token,
  onClose,
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
          // If no text_content, default to html
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-900/90">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-lg text-white truncate">
              {messageSummary.subject || "(Tanpa Subjek)"}
            </h3>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-1">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                {messageSummary.from_name || messageSummary.sender} &lt;{messageSummary.sender}&gt;
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                {new Date(messageSummary.received_at).toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                onDelete(messageSummary.id);
                onClose();
              }}
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              title="Hapus Email Ini"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Highlighted OTP Banner if detected */}
        {otp && (
          <div className="bg-indigo-950/60 border-b border-indigo-500/20 px-6 py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                <KeyRound className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                  Kode Verifikasi / OTP Terdeteksi
                </p>
                <span className="font-mono text-xl font-bold text-white tracking-widest">
                  {otp}
                </span>
              </div>
            </div>

            <button
              onClick={() => onCopyOtp(otp)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors shadow-md shadow-indigo-600/30"
            >
              {copiedOtpId === otp ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin OTP</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* View Mode Toggle Bar (Plain text vs HTML) */}
        {detail?.html_content && (
          <div className="px-6 py-2.5 bg-slate-950/40 border-b border-slate-800/80 flex items-center justify-end gap-2 text-xs">
            <span className="text-slate-500 mr-2">Tampilan:</span>
            <button
              onClick={() => setViewMode("text")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
                viewMode === "text"
                  ? "bg-slate-800 text-white font-medium"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Teks Biasa
            </button>
            <button
              onClick={() => setViewMode("html")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
                viewMode === "html"
                  ? "bg-slate-800 text-white font-medium"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              HTML Bersih
            </button>
          </div>
        )}

        {/* Modal Body / Email Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-950/30">
          {loading ? (
            <div className="flex flex-col gap-3 animate-pulse">
              <div className="h-4 bg-slate-800 rounded w-3/4" />
              <div className="h-4 bg-slate-800 rounded w-full" />
              <div className="h-4 bg-slate-800 rounded w-5/6" />
            </div>
          ) : viewMode === "text" || !detail?.html_content ? (
            <div className="whitespace-pre-wrap font-sans text-sm text-slate-300 leading-relaxed select-text">
              {detail?.text_content || "Tidak ada konten teks yang dapat ditampilkan."}
            </div>
          ) : (
            <div
              className="prose prose-invert max-w-none text-sm text-slate-300 leading-relaxed overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: detail.html_content }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
