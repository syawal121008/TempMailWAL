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
}) => {
  return (
    <header className="w-full border-b sticky top-0 z-40 transition-colors duration-200 border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-[#0b0f17]/85 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-500 flex items-center justify-center shadow-md shadow-orange-500/25">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                Syawal TempMail
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              Email Sementara Cepat & Praktis
            </p>
          </div>
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          <nav className="hidden sm:flex items-center gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
            <button
              onClick={() => onScrollTo("how-it-works")}
              className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
            >
              Cara Pakai
            </button>
            <button
              onClick={() => onScrollTo("faq")}
              className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
            >
              FAQ
            </button>
            <a
              href="https://syawaltzy.biz.id"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:bg-orange-500/20 transition-colors font-semibold text-xs"
            >
              <span>syawaltzy.biz.id</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </nav>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            aria-label="Ganti Tema"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700/60"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-orange-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 hover:text-orange-600" />
            )}
          </button>

          {/* Live indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Aktif</span>
          </div>
        </div>
      </div>
    </header>
  );
};
