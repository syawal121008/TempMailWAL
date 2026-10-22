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
        let borderClass = "border-indigo-500/30 bg-slate-900/90 text-indigo-300";
        let Icon = Info;

        if (toast.type === "success") {
          borderClass = "border-emerald-500/40 bg-slate-900/95 text-emerald-300";
          Icon = CheckCircle2;
        } else if (toast.type === "error") {
          borderClass = "border-rose-500/40 bg-slate-900/95 text-rose-300";
          Icon = AlertCircle;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-5 ${borderClass}`}
          >
            <div className="flex items-center gap-2.5">
              <Icon className="w-4 h-4 shrink-0" />
              <p className="text-sm font-medium text-slate-100">{toast.text}</p>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-slate-100 p-1 rounded-md transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
