import React from "react";
import { Mail, Sun, Moon, ExternalLink } from "lucide-react";

interface HeaderProps {
  onScrollTo: (sectionId: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  isConnected?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onScrollTo,
  isDark,
  onToggleTheme,
  isConnected = true,
}) => {
  return (
    <header className="w-full border-b sticky top-0 z-40 transition-colors duration-200 border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-[#0b0f17]/85 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                Syawal TempMail
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/30">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Email Sementara Aman @syawaltzy.my.id
            </p>
          </div>
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-3 sm:gap-5">
          <nav className="hidden md:flex items-center gap-5 text-sm text-slate-600 dark:text-slate-400">
            <button
              onClick={() => onScrollTo("how-it-works")}
              className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors font-medium"
            >
              Cara Kerja
            </button>
            <button
              onClick={() => onScrollTo("privacy")}
              className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors font-medium"
            >
              Privasi
            </button>
            <button
              onClick={() => onScrollTo("faq")}
              className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors font-medium"
            >
              FAQ
            </button>
            <a
              href="https://syawaltzy.biz.id"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 transition-colors font-semibold"
              title="Kunjungi website utama pemilik"
            >
              <span>syawaltzy.biz.id</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </nav>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            aria-label="Ganti Mode Tema"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700/60"
            title={isDark ? "Beralih ke Mode Terang (Orange)" : "Beralih ke Mode Gelap"}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-orange-400 hover:text-orange-300 transition-colors" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 hover:text-orange-600 transition-colors" />
            )}
          </button>

          {/* Connection status indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">Realtime</span>
          </div>
        </div>
      </div>
    </header>
  );
};
