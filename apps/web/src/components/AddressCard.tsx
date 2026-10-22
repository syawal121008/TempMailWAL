import React, { useState } from "react";
import {
  Copy,
  Check,
  RefreshCw,
  PlusCircle,
  Trash2,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { InboxSession } from "../types";
import { useCountdown } from "../hooks/useCountdown";

interface AddressCardProps {
  session: InboxSession | null;
  loading: boolean;
  refreshing: boolean;
  onGenerate: (durationMinutes?: number) => void;
  onRefresh: () => void;
  onDelete: () => void;
  onCopyAddress: (address: string) => void;
}

export const AddressCard: React.FC<AddressCardProps> = ({
  session,
  loading,
  refreshing,
  onGenerate,
  onRefresh,
  onDelete,
  onCopyAddress,
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<number>(10);

  const { formatted, isExpired, remainingSeconds } = useCountdown(
    session ? session.expires_at : null
  );

  const handleCopy = () => {
    if (!session) return;
    navigator.clipboard.writeText(session.address);
    setCopied(true);
    onCopyAddress(session.address);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalDurationSeconds = session
    ? Math.max(1, Math.floor((session.expires_at - session.created_at) / 1000))
    : 600;
  const progressPercent = Math.min(
    100,
    Math.max(0, (remainingSeconds / totalDurationSeconds) * 100)
  );

  return (
    <div className="rounded-2xl p-6 sm:p-8 relative overflow-hidden transition-all duration-300 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111622] shadow-xl shadow-slate-200/50 dark:shadow-black/40">
      {/* Background ambient warm orange gradient glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-orange-500/10 dark:bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-500/10 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-6">
        {/* Top bar within card */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
              Alamat Email Sementara
            </span>
            <span className="text-slate-400 dark:text-slate-600">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Domain @syawaltzy.my.id
            </span>
          </div>

          {/* Expiration countdown badge */}
          {session && (
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold border ${
                isExpired
                  ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
                  : remainingSeconds < 120
                  ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/40 animate-pulse"
                  : "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{isExpired ? "Kedaluwarsa" : formatted}</span>
            </div>
          )}
        </div>

        {/* Main Address Display Box */}
        <div className="bg-slate-50 dark:bg-[#080c14] border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 sm:p-3 flex items-center justify-between gap-3 shadow-inner">
          <div className="min-w-0 flex-1 px-3 py-1">
            {session ? (
              <span className="font-mono text-base sm:text-xl font-bold text-slate-900 dark:text-white tracking-wide truncate block select-all">
                {session.address}
              </span>
            ) : (
              <span className="font-mono text-sm sm:text-base text-slate-400 dark:text-slate-500 italic">
                {loading ? "Menyiapkan inbox..." : "Belum ada inbox aktif"}
              </span>
            )}
          </div>

          <button
            onClick={handleCopy}
            disabled={!session || isExpired}
            aria-label="Salin Alamat Email"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 active:bg-orange-700 disabled:opacity-40 text-white font-semibold text-sm transition-all shadow-md shadow-orange-600/25 shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span className="hidden sm:inline">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-white" />
                <span className="hidden sm:inline">Salin Alamat</span>
              </>
            )}
          </button>
        </div>

        {/* Progress Bar for Expiration */}
        {session && !isExpired && (
          <div className="w-full bg-slate-100 dark:bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                remainingSeconds < 120
                  ? "bg-rose-500"
                  : "bg-gradient-to-r from-amber-500 to-orange-500"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        {/* Expired Alert */}
        {session && isExpired && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-300 text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              Inbox ini telah kedaluwarsa. Silakan klik tombol "Ganti Alamat" untuk membuat email baru.
            </span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-800/70">
          <div className="flex items-center gap-2">
            {/* Duration Selector */}
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(Number(e.target.value))}
              className="bg-white dark:bg-[#0c1017] border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg px-2.5 py-2 outline-none focus:border-orange-500 transition-colors cursor-pointer"
            >
              <option value={10}>10 Menit</option>
              <option value={30}>30 Menit</option>
              <option value={60}>60 Menit</option>
            </select>

            {/* Generate Button */}
            <button
              onClick={() => onGenerate(selectedDuration)}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 text-slate-800 dark:text-slate-200 text-sm font-semibold border border-slate-300 dark:border-slate-700 transition-all"
            >
              <PlusCircle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span>{session ? "Ganti Alamat" : "Buat Email"}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={!session || refreshing}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium border border-slate-300 dark:border-slate-700 transition-colors"
              title="Perbarui Kotak Masuk Sekarang"
            >
              <RefreshCw
                className={`w-4 h-4 text-orange-600 dark:text-orange-400 ${
                  refreshing ? "animate-spin" : ""
                }`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {/* Delete Button */}
            {session && (
              <button
                onClick={onDelete}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 text-sm font-medium border border-rose-500/20 transition-colors"
                title="Hapus Inbox Sekarang"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Hapus</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
