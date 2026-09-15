import React, { useState } from "react";
import { CampaignPrompts } from "../types";
import { Clock, Film, Volume2, UserCheck, TrendingUp, CheckCircle2, AlertCircle } from "lucide-react";

interface OverviewTabProps {
  campaign: CampaignPrompts;
  onExplorePrompts: () => void;
  onLaunchSimulator: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  campaign,
  onExplorePrompts,
  onLaunchSimulator,
}) => {
  const [hoveredScene, setHoveredScene] = useState<string | null>(null);

  // Extract scenes data from all 3 prompts
  const allScenes = [
    ...campaign.VIDEO_PROMPT_1.scenes.map((s, i) => ({ ...s, promptIndex: 1, sceneIndex: i + 1, id: `P1-S${i+1}` })),
    ...campaign.VIDEO_PROMPT_2.scenes.map((s, i) => ({ ...s, promptIndex: 2, sceneIndex: i + 1, id: `P2-S${i+1}` })),
    ...campaign.VIDEO_PROMPT_3.scenes.map((s, i) => ({ ...s, promptIndex: 3, sceneIndex: i + 1, id: `P3-S${i+1}` })),
  ];

  const totalWords = allScenes.reduce((acc, s) => acc + s.words, 0);
  const avgWordsPerScene = (totalWords / allScenes.length).toFixed(1);

  // Emotional intensity retention milestones
  const retentionPoints = [
    { label: "0s (Hook)", value: 95, note: "Pemberhentian scroll ekstrem (Wajah kaget & produk)" },
    { label: "4s (Detail)", value: 78, note: "Eksplorasi fisik & ketebalan material" },
    { label: "8s (Penasaran)", value: 82, note: "Janji pengujian fungsi langsung" },
    { label: "12s (Tes Nyata)", value: 86, note: "Demo no-gimmick & cara pakai instan" },
    { label: "16s (Hasil)", value: 92, note: "Pembuktian hasil nyata close-up" },
    { label: "20s (Bukti)", value: 89, note: "Penampakan tumpukan paket pengiriman" },
    { label: "24s (Diskon)", value: 94, note: "Urgensi harga promo & opsi pembayaran" },
    { label: "30s (CTA)", value: 98, note: "Dorongan aksi verbal di detik penutup" },
  ];

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider">
          <TrendingUp className="w-4 h-4" />
          <span>Dashboard Analisis Kampanye Video UGC</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Arsitektur & Strategi UGC TikTok Affiliate</h2>
            <p className="text-slate-600 text-sm leading-relaxed max-w-3xl mt-1">
              Struktur 3 babak video 10 detik (Total 30s) terintegrasi untuk membangun rasa penasaran (Curiosity),
              pembuktian nyata tanpa rekayasa (Demonstration), hingga urgensi sosial dan ajakan beli tegas (Social Proof & CTA).
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onExplorePrompts}
              className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-xl border border-indigo-200 transition"
            >
              Lihat Detail Babak →
            </button>
            <button
              onClick={onLaunchSimulator}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition shadow-sm"
            >
              Buka Teleprompter ⏱️
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl text-2xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Durasi Kampanye</p>
            <p className="text-xl font-bold text-slate-900">
              30 Detik <span className="text-xs font-normal text-slate-500">(3 × 10s)</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl text-2xl">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Jumlah Klip Adegan</p>
            <p className="text-xl font-bold text-slate-900">
              15 Adegan <span className="text-xs font-normal text-slate-500">(2s / adegan)</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl text-2xl">
            <Volume2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Rata-rata Kata/Klip</p>
            <p className="text-xl font-bold text-slate-900">
              {avgWordsPerScene} Kata <span className="text-xs font-normal text-emerald-600 font-semibold">(Ideal 6-8)</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl text-2xl">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Persona Suara (Locked)</p>
            <p className="text-xl font-bold text-slate-900">
              Wanita 18 th <span className="text-xs font-normal text-slate-500">(Aksen Jawa)</span>
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Visualizers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Sebaran Kata per Adegan 2-Detik */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Sebaran Kata per Adegan (2 Detik)</h3>
                <p className="text-xs text-slate-500">Standar optimal: 6-8 kata per adegan (3-4 kata/detik)</p>
              </div>
              <span className="text-xs px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full font-semibold border border-indigo-100">
                15 Klip Adegan
              </span>
            </div>

            {/* Custom Bar Graph */}
            <div className="h-56 w-full flex items-end justify-between gap-1.5 pt-6 pb-2 border-b border-slate-100">
              {allScenes.map((sc) => {
                const heightPercent = Math.min((sc.words / 10) * 100, 100);
                const isIdeal = sc.words >= 6 && sc.words <= 8;
                const isSelected = hoveredScene === sc.id;

                return (
                  <div
                    key={sc.id}
                    className="flex-1 flex flex-col items-center group relative cursor-pointer"
                    onMouseEnter={() => setHoveredScene(sc.id)}
                    onMouseLeave={() => setHoveredScene(null)}
                  >
                    {/* Tooltip */}
                    <div
                      className={`absolute -top-12 z-20 bg-slate-900 text-white text-[11px] rounded-lg px-2.5 py-1 whitespace-nowrap pointer-events-none transition-all duration-150 shadow-md ${
                        isSelected ? "opacity-100 scale-100" : "opacity-0 scale-95"
                      }`}
                    >
                      <span className="font-bold">{sc.id}</span>: {sc.words} Kata ({sc.time})
                    </div>

                    {/* Bar */}
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full max-w-[24px] rounded-t-md transition-all duration-200 ${
                        isIdeal
                          ? isSelected
                            ? "bg-indigo-700"
                            : "bg-indigo-500 hover:bg-indigo-600"
                          : "bg-amber-500 hover:bg-amber-600"
                      }`}
                    />

                    {/* Label below */}
                    <span className="text-[10px] font-mono text-slate-500 mt-2 rotate-[-45deg] origin-top-left translate-y-1">
                      {sc.id}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Scale legend */}
            <div className="flex justify-between items-center text-[11px] text-slate-400 mt-3 px-1">
              <span>0 Kata</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                Zona Ideal: 6 - 8 Kata
              </span>
              <span>10 Kata</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              <strong>Analisis Ritme:</strong> Seluruh 15 klip adegan terjaga pada ritme 6-8 kata. Hal ini menjamin tempo pengisi suara sangat cepat khas TikTok tanpa terdengar terengah-engah dan tanpa ada momen hening (zero dead-air).
            </p>
          </div>
        </div>

        {/* Chart 2: Kurva Retensi Emosional */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Kurva Intensitas Emosional & Retensi</h3>
                <p className="text-xs text-slate-500">Tingkat dorongan rasa penasaran hingga dorongan aksi beli</p>
              </div>
              <span className="text-xs px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full font-semibold border border-amber-200">
                Retention Arc
              </span>
            </div>

            {/* Retention Arc Graphic using responsive SVG */}
            <div className="h-56 w-full flex items-center justify-center relative">
              <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="gradientArc" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                  <linearGradient id="fillArea" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid guidelines */}
                <line x1="20" y1="40" x2="480" y2="40" stroke="#f1f5f9" strokeDasharray="4 4" strokeWidth="1" />
                <line x1="20" y1="100" x2="480" y2="100" stroke="#f1f5f9" strokeDasharray="4 4" strokeWidth="1" />
                <line x1="20" y1="160" x2="480" y2="160" stroke="#f1f5f9" strokeDasharray="4 4" strokeWidth="1" />

                {/* Area fill under curve */}
                <path
                  d="M 30,50 C 90,110 150,90 220,70 C 290,50 360,65 470,25 L 470,180 L 30,180 Z"
                  fill="url(#fillArea)"
                />

                {/* Main Curve Line */}
                <path
                  d="M 30,50 C 90,110 150,90 220,70 C 290,50 360,65 470,25"
                  fill="none"
                  stroke="url(#gradientArc)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Points on Curve */}
                <circle cx="30" cy="50" r="5" fill="#6366f1" className="animate-pulse" />
                <circle cx="155" cy="85" r="4.5" fill="#6366f1" />
                <circle cx="220" cy="70" r="4.5" fill="#f59e0b" />
                <circle cx="330" cy="60" r="4.5" fill="#f59e0b" />
                <circle cx="470" cy="25" r="5.5" fill="#ef4444" className="animate-pulse" />

                {/* Milestone labels */}
                <text x="30" y="32" fontSize="10" fill="#4338ca" textAnchor="middle" fontWeight="bold">Hook 95%</text>
                <text x="155" y="105" fontSize="9" fill="#64748b" textAnchor="middle">Curiosity</text>
                <text x="220" y="52" fontSize="9" fill="#d97706" textAnchor="middle">Demo Nyata</text>
                <text x="330" y="45" fontSize="9" fill="#d97706" textAnchor="middle">Social Proof</text>
                <text x="470" y="14" fontSize="10" fill="#b91c1c" textAnchor="middle" fontWeight="bold">CTA 98%</text>
              </svg>
            </div>

            {/* Milestones bar */}
            <div className="grid grid-cols-4 gap-2 text-center text-[10px] text-slate-500 border-t border-slate-100 pt-2">
              <div>
                <span className="font-bold text-indigo-600 block">0 - 3s</span>
                Scroll Stopper
              </div>
              <div>
                <span className="font-bold text-slate-700 block">4 - 10s</span>
                Discovery & Fitur
              </div>
              <div>
                <span className="font-bold text-amber-600 block">10 - 20s</span>
                Bukti Fungsi Nyata
              </div>
              <div>
                <span className="font-bold text-rose-600 block">20 - 30s</span>
                FOMO & CTA Belanja
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              <strong>Kunci Konversi:</strong> Puncak keterkejutan visual terjadi pada 0-3s Prompt 1 (Frame 0-detik) untuk mematahkan kebiasaan scrolling penonton, disusul pembuktian fungsi di video kedua, dan penutupan urgensi di 2 detik terakhir video ketiga.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
