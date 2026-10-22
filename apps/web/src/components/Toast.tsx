import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { ToastMessage } from "../types";

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        let borderClass =
          "border-orange-500/30 bg-white/95 dark:bg-[#111726]/95 text-orange-600 dark:text-orange-400";
        let Icon = Info;

        if (toast.type === "success") {
          borderClass =
            "border-emerald-500/40 bg-white/95 dark:bg-[#111726]/95 text-emerald-600 dark:text-emerald-400";
          Icon = CheckCircle2;
        } else if (toast.type === "error") {
          borderClass =
            "border-rose-500/40 bg-white/95 dark:bg-[#111726]/95 text-rose-600 dark:text-rose-400";
          Icon = AlertCircle;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-slide-down ${borderClass}`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Icon className="w-4 h-4 shrink-0" />
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                {toast.text}
              </p>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-md transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
