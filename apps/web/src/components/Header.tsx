import React from "react";
import { Mail, ShieldCheck, Sparkles, Wifi } from "lucide-react";

interface HeaderProps {
  onScrollTo: (sectionId: string) => void;
  isConnected?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onScrollTo, isConnected = true }) => {
  return (
    <header className="w-full border-b border-slate-800/80 bg-background/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Syawal TempMail
              </span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Email Sementara Aman @syawaltzy.my.id
            </p>
          </div>
        </div>

        {/* Navigation & Status */}
        <div className="flex items-center gap-4 sm:gap-6">
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-400">
            <button
              onClick={() => onScrollTo("how-it-works")}
              className="hover:text-slate-200 transition-colors"
            >
              Cara Kerja
            </button>
            <button
              onClick={() => onScrollTo("privacy")}
              className="hover:text-slate-200 transition-colors"
            >
              Privasi
            </button>
            <button
              onClick={() => onScrollTo("faq")}
              className="hover:text-slate-200 transition-colors"
            >
              FAQ
            </button>
          </nav>

          {/* Connection status indicator */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">Live Routing</span>
          </div>
        </div>
      </div>
    </header>
  );
};
