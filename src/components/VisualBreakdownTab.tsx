import React, { useState } from "react";
import { CampaignPrompts, VideoPrompt } from "../types";
import { Copy, Check, Sparkles, Video, Eye, ShieldAlert, Film } from "lucide-react";

interface VisualBreakdownTabProps {
  campaign: CampaignPrompts;
}

export const VisualBreakdownTab: React.FC<VisualBreakdownTabProps> = ({ campaign }) => {
  const [selectedPromptNum, setSelectedPromptNum] = useState<1 | 2 | 3>(1);
  const [copied, setCopied] = useState(false);

  const promptKey = `VIDEO_PROMPT_${selectedPromptNum}` as keyof CampaignPrompts;
  const promptData: VideoPrompt = campaign[promptKey];

  const handleCopyJSON = () => {
    const text = JSON.stringify({ [promptKey]: promptData }, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Tab Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider">
          <Film className="w-4 h-4" />
          <span>Detail Rangkaian Prompt Video (3 Babak Bersambung)</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Eksplorasi Detail 3 Chapter Prompt</h2>
            <p className="text-slate-600 text-sm leading-relaxed max-w-3xl mt-1">
              Setiap babak dirancang dengan fungsi narasi unik namun memiliki kesinambungan (*Continuity*) karakter dan lingkungan.
              Seluruh rekaman mengadopsi prinsip <strong>Raw UGC</strong>: tanpa lampu studio buatan, tanpa teks tempel buatan, dan tanpa stiker.
            </p>
          </div>
          <button
            onClick={handleCopyJSON}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition flex items-center space-x-2 shadow-sm shrink-0"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "JSON Disalin!" : `Salin JSON Prompt ${selectedPromptNum}`}</span>
          </button>
        </div>
      </div>

      {/* 3 Prompts Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { num: 1, title: "Curiosity & Discovery", duration: "10s (0-10s)", focus: "Pemberhentian Scroll Awal" },
          { num: 2, title: "Demonstration & Reaction", duration: "10s (10-20s)", focus: "Uji Fungsi Nyata No-Gimmick" },
          { num: 3, title: "Social Proof & Urgency", duration: "10s (20-30s)", focus: "Bukti Paket & Closing CTA" },
        ].map((item) => {
          const isSelected = selectedPromptNum === item.num;
          return (
            <button
              key={item.num}
              onClick={() => setSelectedPromptNum(item.num as 1 | 2 | 3)}
              className={`p-4 rounded-xl border text-left transition-all relative ${
                isSelected
                  ? "bg-indigo-50 border-indigo-500 ring-2 ring-indigo-200 shadow-sm"
                  : "bg-white border-slate-200 hover:bg-slate-50"
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${
                    isSelected ? "text-indigo-600" : "text-slate-500"
                  }`}
                >
                  Prompt {item.num} • {item.duration}
                </span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                )}
              </div>
              <p className="font-bold text-slate-900 text-sm">{item.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{item.focus}</p>
            </button>
          );
        })}
      </div>

      {/* Selected Prompt Content Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        {/* Card Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-4 gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-lg">
                Babak {selectedPromptNum} of 3
              </span>
              <span className="text-xs font-medium text-slate-500">
                Durasi: {promptData.duration} • 5 Adegan (2s/adegan)
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mt-1.5 flex items-center gap-2">
              <span>Prompt {selectedPromptNum}: {promptData.prompt_type}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Target Produk: <span className="text-slate-800 font-semibold">{promptData.product}</span>
            </p>
          </div>

          {/* CTA Rule Badge */}
          <div
            className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border flex items-center space-x-1.5 ${
              selectedPromptNum === 3
                ? "bg-rose-50 text-rose-700 border-rose-200"
                : "bg-emerald-50 text-emerald-700 border-emerald-200"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>CTA: {promptData.cta}</span>
          </div>
        </div>

        {/* 3 Core Direction Specs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Konsep Kreatif Babak:
            </span>
            <p className="text-slate-600 leading-relaxed">{promptData.creative_concept}</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-indigo-600" />
              Kontinuitas Karakter & Set:
            </span>
            <p className="text-slate-600 leading-relaxed">{promptData.continuity}</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-indigo-600" />
              Gaya Visual Raw UGC:
            </span>
            <p className="text-slate-600 leading-relaxed">{promptData.visual_style}</p>
          </div>
        </div>

        {/* Negative Constraints (Anti-Slop Rules) */}
        {promptData.negative_constraints && promptData.negative_constraints.length > 0 && (
          <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl space-y-1.5">
            <span className="text-xs font-bold text-rose-800 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              Larangan Keras Babak Ini (Negative Constraints):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {promptData.negative_constraints.map((neg, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-medium px-2.5 py-0.5 bg-white text-rose-700 rounded-md border border-rose-200 shadow-2xs"
                >
                  ✕ {neg}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 5 Scenes per 2-Second Grid */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-slate-900 text-sm">
              Rincian 5 Adegan Per 2 Detik (Kamera & Voiceover Sinkron):
            </h4>
            <span className="text-xs text-slate-500 font-medium">Batas kata: 6 - 8 kata per adegan</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {promptData.scenes.map((scene, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 hover:border-indigo-300 transition"
              >
                <div className="flex justify-between items-center text-xs font-bold border-b border-slate-200 pb-2">
                  <span className="text-indigo-700">
                    Adegan {idx + 1} ({scene.time})
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded font-mono text-[11px] ${
                      scene.words >= 6 && scene.words <= 8
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {scene.words} Kata
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                    <Video className="w-3 h-3 text-indigo-500" />
                    Kamera & Visual Fisik:
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-100 min-h-[56px]">
                    {scene.visual}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                    <span className="text-xs">🎙️</span>
                    Naskah Suara (Voiceover):
                  </p>
                  <p className="text-xs font-bold text-indigo-950 bg-indigo-50/70 p-2.5 rounded-lg border border-indigo-100 leading-relaxed">
                    "{scene.vo}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
