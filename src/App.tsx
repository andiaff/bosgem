import React, { useState } from "react";
import { CampaignPrompts } from "./types";
import { INITIAL_CAMPAIGN } from "./data/defaultData";
import { Header } from "./components/Header";
import { PromptBuilderTab } from "./components/PromptBuilderTab";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error";
}

export default function App() {
  const [campaign, setCampaign] = useState<CampaignPrompts>(INITIAL_CAMPAIGN);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const handleCampaignGenerated = (newCampaign: CampaignPrompts) => {
    setCampaign(newCampaign);
  };

  return (
    <div className="bg-slate-50 text-slate-800 font-sans antialiased min-h-screen flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Header */}
      <Header />

      {/* Main Content: Direct Prompt Builder */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <PromptBuilderTab
          currentCampaign={campaign}
          onCampaignGenerated={handleCampaignGenerated}
          showToast={showToast}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-5 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 space-y-1">
          <p className="font-semibold text-slate-700">
            TikTok &amp; Shopee Affiliate Creative Director Engine • Raw UGC Standard
          </p>
          <p className="text-[11px] text-slate-400">
            Sistem Pembuatan Prompt Naskah Video 10-Detik Terintegrasi (3 Babak Bersambung, 2 Detik Per Adegan, 6-8 Kata, Suara Terkunci).
          </p>
        </div>
      </footer>

      {/* Toast Notification Container */}
      <div className="fixed bottom-3 right-3 left-3 sm:left-auto sm:bottom-5 sm:right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl shadow-lg text-white text-xs font-semibold pointer-events-auto flex items-center space-x-2 transition-all duration-300 transform translate-y-0 ${
              toast.type === "error" ? "bg-rose-600 shadow-rose-900/20" : "bg-emerald-600 shadow-emerald-900/20"
            }`}
          >
            {toast.type === "error" ? (
              <AlertCircle className="w-4 h-4 shrink-0 text-white" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
            )}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
