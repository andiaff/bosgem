import React from "react";
import { Clapperboard, Sparkles, Mic, Video, CheckCircle2 } from "lucide-react";

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo & Main Title */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Clapperboard className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-lg font-bold text-slate-900 leading-tight flex items-center gap-1.5 truncate">
                <span className="truncate">Affiliate Video Director</span>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 sm:px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200 shrink-0">
                  Prompt Studio
                </span>
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">
                Generator Prompt 3 Kolom Video TikTok &amp; Shopee Affiliate
              </p>
            </div>
          </div>

          {/* Core System Badges */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <div className="hidden lg:flex items-center gap-2">
              <span className="text-[11px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-lg border border-slate-200 flex items-center gap-1">
                <Mic className="w-3 h-3 text-purple-600" />
                <span>Wanita 18th Jatim</span>
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-lg border border-slate-200 flex items-center gap-1">
                <Video className="w-3 h-3 text-blue-600" />
                <span>5 Adegan (2s/Adegan)</span>
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>6-8 Kata VO</span>
              </span>
            </div>

            <div className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] sm:text-xs font-bold">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-600 shrink-0" />
              <span className="whitespace-nowrap">3 Kolom JSON</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
