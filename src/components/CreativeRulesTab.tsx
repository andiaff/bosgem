import React, { useState } from "react";
import { CREATIVE_RULES } from "../data/defaultData";
import { BookOpen, Search, Check, ShieldCheck } from "lucide-react";

export const CreativeRulesTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("All");

  const allTags = ["All", ...Array.from(new Set(CREATIVE_RULES.map((r) => r.tag)))];

  const filteredRules = CREATIVE_RULES.filter((rule) => {
    const matchesSearch =
      rule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === "All" || rule.tag === selectedTag;
    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Panduan Pengarahan Kreatif & Anti-Repetition Engine</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Aturan Pengarahan Kreatif Affiliate</h2>
            <p className="text-slate-600 text-sm leading-relaxed max-w-3xl mt-1">
              Sistem naskah ini dirancang agar video terasa seperti rekaman dokumenter jujur dari kreator Indonesia,
              bukan iklan komersial televisi yang kaku. Seluruh aturan ini diintegrasikan ke dalam generator prompt AI.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Standar Raw UGC Terverifikasi</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari aturan kreatif..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                selectedTag === tag
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRules.map((rule) => (
          <div
            key={rule.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:border-indigo-300 hover:shadow-md transition group"
          >
            <div className="flex justify-between items-center">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-xs group-hover:bg-indigo-600 group-hover:text-white transition">
                {rule.id}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                {rule.tag}
              </span>
            </div>

            <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-indigo-600 transition">
              {rule.title}
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              {rule.description}
            </p>
          </div>
        ))}
      </div>

      {filteredRules.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6 space-y-2">
          <p className="text-slate-500 text-sm">Tidak ada aturan yang cocok dengan pencarian "{searchTerm}".</p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedTag("All");
            }}
            className="text-xs text-indigo-600 font-bold hover:underline"
          >
            Reset Filter
          </button>
        </div>
      )}
    </div>
  );
};
