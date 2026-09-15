import React from "react";
import { VideoConceptId } from "../types";
import { VIDEO_CONCEPTS } from "../data/videoConcepts";
import {
  Sparkles,
  Flame,
  CheckCircle2,
  Users,
  Hammer,
  PackageCheck,
  ShieldCheck,
  Zap,
  Clock,
  ArrowRight,
} from "lucide-react";

interface VideoConceptSelectorProps {
  selectedConceptId: VideoConceptId;
  onSelectConcept: (id: VideoConceptId) => void;
}

export const VideoConceptSelector: React.FC<VideoConceptSelectorProps> = ({
  selectedConceptId,
  onSelectConcept,
}) => {
  const getConceptIcon = (id: VideoConceptId) => {
    switch (id) {
      case "social_proof":
        return <Users className="w-5 h-5 text-indigo-600" />;
      case "stress_test":
        return <Hammer className="w-5 h-5 text-rose-600" />;
      case "unboxing_viral":
        return <PackageCheck className="w-5 h-5 text-amber-600" />;
      case "problem_solution":
        return <Zap className="w-5 h-5 text-emerald-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-indigo-600" />;
    }
  };

  const getBorderAndBg = (id: VideoConceptId, isSelected: boolean) => {
    if (!isSelected) {
      return "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70";
    }

    switch (id) {
      case "social_proof":
        return "border-indigo-500 bg-indigo-50/40 ring-2 ring-indigo-300/60 shadow-md";
      case "stress_test":
        return "border-rose-500 bg-rose-50/40 ring-2 ring-rose-300/60 shadow-md";
      case "unboxing_viral":
        return "border-amber-500 bg-amber-50/40 ring-2 ring-amber-300/60 shadow-md";
      case "problem_solution":
        return "border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-300/60 shadow-md";
      default:
        return "border-indigo-500 bg-indigo-50/40 ring-2 ring-indigo-300/60 shadow-md";
    }
  };

  const getBadgeStyle = (id: VideoConceptId) => {
    switch (id) {
      case "social_proof":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "stress_test":
        return "bg-rose-100 text-rose-800 border-rose-200";
      case "unboxing_viral":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "problem_solution":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default:
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
    }
  };

  const selectedConcept = VIDEO_CONCEPTS.find((c) => c.id === selectedConceptId) || VIDEO_CONCEPTS[0];

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 border-b border-slate-100 pb-2.5">
        <div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="p-1 sm:p-1.5 rounded-lg bg-indigo-100 text-indigo-700 shrink-0">
              <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Pilih Konsep Video Afiliasi
            </h3>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5">
            Formula hook visual &amp; naskah voice over disesuaikan otomatis dengan produk Anda.
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 text-[10px] sm:text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 sm:py-1 rounded-lg border border-indigo-100 self-start sm:self-auto">
          <Clock className="w-3 h-3 text-indigo-600" />
          <span>Hook 0-3 Detik Pertama</span>
        </div>
      </div>

      {/* Grid of 4 Concepts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5">
        {VIDEO_CONCEPTS.map((concept) => {
          const isSelected = concept.id === selectedConceptId;

          return (
            <div
              key={concept.id}
              onClick={() => onSelectConcept(concept.id)}
              className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${getBorderAndBg(
                concept.id,
                isSelected
              )}`}
            >
              <div>
                {/* Header: Tag, Badge & Selected Check */}
                <div className="flex items-start justify-between gap-2 mb-1.5 sm:mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="p-1.5 sm:p-2 rounded-xl bg-white shadow-2xs border border-slate-200 shrink-0">
                      {getConceptIcon(concept.id)}
                    </div>
                    <div className="min-w-0">
                      <span
                        className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-md border uppercase tracking-wider ${getBadgeStyle(
                          concept.id
                        )}`}
                      >
                        {concept.badge}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 truncate">
                        {concept.title}
                      </h4>
                    </div>
                  </div>

                  <div className="shrink-0 mt-0.5">
                    {isSelected ? (
                      <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                      </span>
                    ) : (
                      <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-slate-300 block" />
                    )}
                  </div>
                </div>

                {/* Subtitle / Title Structure */}
                <p className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-500 mb-1.5">
                  {concept.subtitle}
                </p>

                {/* Hook 3 Detik Highlights */}
                <div className="bg-white/90 p-2 sm:p-2.5 rounded-xl border border-slate-200/80 mb-2 sm:mb-2.5 space-y-0.5">
                  <div className="text-[9px] sm:text-[10px] font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-500" />
                    Hook 3 Detik (Pencegah Scroll):
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-700 italic leading-snug">
                    "{concept.hookThreeSeconds}"
                  </p>
                </div>

                {/* 3 Chapters Mini Journey */}
                <div className="space-y-0.5 text-[10px] sm:text-[11px] text-slate-600">
                  <div className="flex items-start gap-1.5">
                    <span className="font-bold font-mono text-indigo-700 shrink-0">P1:</span>
                    <span className="truncate">{concept.p1Summary}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="font-bold font-mono text-indigo-700 shrink-0">P2:</span>
                    <span className="truncate">{concept.p2Summary}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="font-bold font-mono text-indigo-700 shrink-0">P3:</span>
                    <span className="truncate">{concept.p3Summary}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Selected Indicator */}
              <div className="pt-2 mt-2 border-t border-slate-200/70 flex items-center justify-between text-[10px] sm:text-[11px]">
                <span className="font-semibold text-slate-500 truncate">{concept.bestFor}</span>
                <span
                  className={`font-bold flex items-center gap-0.5 shrink-0 ${
                    isSelected ? "text-indigo-700" : "text-slate-400 group-hover:text-slate-600"
                  }`}
                >
                  {isSelected ? "Terpilih ✓" : "Pilih"}
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Strategy Note */}
      <div className="p-2.5 sm:p-3 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-xl text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 sm:gap-2 shadow-xs">
        <div className="flex items-center gap-2 min-w-0">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium text-[11px] sm:text-xs truncate">
            Konsep: <strong className="text-amber-300">{selectedConcept.title}</strong> — Hook visual 0-3s &amp; VO disesuaikan presisi.
          </span>
        </div>
        <span className="text-[9px] sm:text-[10px] text-slate-300 font-mono shrink-0 bg-white/10 px-1.5 py-0.5 rounded self-end sm:self-auto">
          4K UHD • 9:16
        </span>
      </div>
    </div>
  );
};
