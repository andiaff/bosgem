import React, { useState, useEffect } from "react";
import { CampaignPrompts, VideoPrompt } from "../types";
import { playFullPromptAudio, stopAllSpeech } from "../utils/speechUtils";
import {
  Copy,
  Check,
  Play,
  Square,
  Volume2,
  Code2,
  Layers,
  Sparkles,
  Clock,
  ShieldCheck,
  Film,
  CheckCircle2,
  Sliders,
} from "lucide-react";

interface ThreeColumnPromptsProps {
  campaign: CampaignPrompts;
  onCopyNotice: (msg: string) => void;
}

interface PromptPlayback {
  activeKey: string | null;
  activeSceneIndex: number;
  isPlaying: boolean;
}

export const ThreeColumnPrompts: React.FC<ThreeColumnPromptsProps> = ({
  campaign,
  onCopyNotice,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [viewModes, setViewModes] = useState<Record<string, "cards" | "json">>({
    VIDEO_PROMPT_1: "cards",
    VIDEO_PROMPT_2: "cards",
    VIDEO_PROMPT_3: "cards",
  });
  const [playback, setPlayback] = useState<PromptPlayback>({
    activeKey: null,
    activeSceneIndex: -1,
    isPlaying: false,
  });
  const [speechSpeed, setSpeechSpeed] = useState<number>(1.25);
  const stopCallbackRef = React.useRef<(() => void) | null>(null);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      stopAllSpeech();
    };
  }, []);

  const handleCopy = (key: keyof CampaignPrompts, promptObj: VideoPrompt) => {
    const jsonString = JSON.stringify({ [key]: promptObj }, null, 2);
    navigator.clipboard.writeText(jsonString);
    setCopiedKey(key);
    onCopyNotice(`JSON untuk ${key} berhasil disalin ke clipboard!`);
    setTimeout(() => setCopiedKey(null), 2200);
  };

  const handleTogglePlayVoiceOver = (key: keyof CampaignPrompts, promptObj: VideoPrompt) => {
    // If currently playing this prompt, stop it
    if (playback.isPlaying && playback.activeKey === key) {
      if (stopCallbackRef.current) {
        stopCallbackRef.current();
      } else {
        stopAllSpeech();
      }
      setPlayback({ activeKey: null, activeSceneIndex: -1, isPlaying: false });
      return;
    }

    // Stop any other playing prompt
    if (stopCallbackRef.current) {
      stopCallbackRef.current();
    }
    stopAllSpeech();

    setPlayback({ activeKey: key, activeSceneIndex: 0, isPlaying: true });

    const scenesToPlay = (promptObj.story || promptObj.scenes || []).map((s) => ({
      time: s.time,
      visual: s.visual,
      vo: s.voice_over || s.vo || "",
      words: s.words,
    }));

    const stopFn = playFullPromptAudio({
      scenes: scenesToPlay,
      promptKey: key,
      speed: speechSpeed,
      pitch: 1.15,
      onSceneChange: (sceneIdx) => {
        setPlayback({ activeKey: key, activeSceneIndex: sceneIdx, isPlaying: true });
      },
      onFinish: () => {
        setPlayback({ activeKey: null, activeSceneIndex: -1, isPlaying: false });
        stopCallbackRef.current = null;
      },
      onError: (err) => {
        console.error("Playback error:", err);
        setPlayback({ activeKey: null, activeSceneIndex: -1, isPlaying: false });
        stopCallbackRef.current = null;
      },
    });

    stopCallbackRef.current = stopFn;
  };

  const promptConfigs: {
    key: keyof CampaignPrompts;
    label: string;
    stage: string;
    color: string;
    badgeBg: string;
    ctaExpected: string;
  }[] = [
    {
      key: "VIDEO_PROMPT_1",
      label: "Prompt 1: Curiosity & Hook",
      stage: "Babak 1 (0-10s)",
      color: "border-indigo-200 hover:border-indigo-300",
      badgeBg: "bg-indigo-50 text-indigo-700 border-indigo-200",
      ctaExpected: "TIDAK ADA CTA (Fokus Hook)",
    },
    {
      key: "VIDEO_PROMPT_2",
      label: "Prompt 2: Demo & Solusi",
      stage: "Babak 2 (10-20s)",
      color: "border-blue-200 hover:border-blue-300",
      badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
      ctaExpected: "TIDAK ADA CTA (Fokus Solusi)",
    },
    {
      key: "VIDEO_PROMPT_3",
      label: "Prompt 3: Bukti & Closing CTA",
      stage: "Babak 3 (20-30s)",
      color: "border-emerald-200 hover:border-emerald-300",
      badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      ctaExpected: "CTA VERBAL TERKUNCI (8-10s)",
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Section Header with Global Controls */}
      <div className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="text-base sm:text-xl font-bold text-slate-900">3 Kolom Prompt Video JSON</h2>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5">
            Format 3 babak bersambung (10 detik per babak) lengkap dengan tombol salin JSON dan voiceover Jawa 18th.
          </p>
        </div>

        {/* Global Speed Selector */}
        <div className="flex items-center space-x-2 bg-slate-50 p-1.5 sm:p-2 rounded-xl border border-slate-200 text-xs self-start sm:self-auto">
          <Sliders className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="font-semibold text-slate-700 text-[11px] sm:text-xs whitespace-nowrap">Tempo VO:</span>
          <div className="flex gap-1">
            {[1.0, 1.25, 1.4].map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => setSpeechSpeed(spd)}
                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[11px] sm:text-xs font-bold transition ${
                  speechSpeed === spd
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
                }`}
              >
                {spd}x {spd === 1.25 ? "⚡" : ""}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3 COLUMNS CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-start">
        {promptConfigs.map((cfg, colIdx) => {
          const promptObj = campaign[cfg.key];
          const isCopied = copiedKey === cfg.key;
          const isCurrentlyPlaying = playback.isPlaying && playback.activeKey === cfg.key;
          const activeSceneIdx = isCurrentlyPlaying ? playback.activeSceneIndex : -1;
          const currentView = viewModes[cfg.key] || "cards";

          const jsonPayload = JSON.stringify({ [cfg.key]: promptObj }, null, 2);

          return (
            <div
              key={cfg.key}
              id={`column-${cfg.key}`}
              className={`bg-white rounded-xl sm:rounded-2xl border-2 transition-all duration-200 shadow-xs flex flex-col h-full overflow-hidden ${
                isCurrentlyPlaying ? "border-indigo-500 ring-2 ring-indigo-200 shadow-md" : cfg.color
              }`}
            >
              {/* Column Top Bar */}
              <div className="p-3.5 sm:p-4 bg-slate-50/80 border-b border-slate-200 space-y-2 sm:space-y-2.5">
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg border ${cfg.badgeBg}`}>
                    {cfg.stage}
                  </span>
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    {promptObj.aspect_ratio && (
                      <span className="text-[9px] sm:text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded">
                        {promptObj.aspect_ratio}
                      </span>
                    )}
                    {promptObj.resolution && (
                      <span className="text-[9px] sm:text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                        4K UHD
                      </span>
                    )}
                    <span className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-500 flex items-center gap-0.5">
                      <Clock className="w-3 h-3" /> 10s
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {promptObj.prompt_title || cfg.label}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-600 line-clamp-2 mt-0.5">
                    {promptObj.creative_concept || promptObj.prompt_type}
                  </p>
                </div>

                {/* Product spec tag */}
                {promptObj.product && (
                  <div className="text-[10px] sm:text-[11px] bg-white p-2 rounded-lg sm:rounded-xl border border-slate-200/90 text-slate-700 font-medium shadow-2xs">
                    <span className="inline-block font-bold text-indigo-700 bg-indigo-50 px-1 py-0.5 rounded mr-1">
                      Produk:
                    </span>
                    <span className="text-slate-800 leading-snug break-words">
                      {promptObj.product}
                    </span>
                  </div>
                )}

                {/* Reference Priority Tag */}
                {promptObj.product_reference_priority && (
                  <div className="text-[10px] bg-amber-50/70 p-2 rounded-lg border border-amber-200 text-amber-900 space-y-1">
                    <div className="font-bold flex items-center gap-1 text-amber-800">
                      <Sparkles className="w-3 h-3" />
                      Visual Reference Locked (100% Identik)
                    </div>
                    {promptObj.product_reference_priority.colors && (
                      <div className="flex flex-wrap gap-1">
                        {promptObj.product_reference_priority.colors.map((c, i) => (
                          <span key={i} className="px-1.5 py-0.2 bg-white rounded border border-amber-200 text-amber-800 font-mono text-[9px]">
                            {c}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TWO PRIMARY MANDATED ACTION BUTTONS: COPY & PLAY VO */}
                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  {/* BUTTON 1: COPY JSON */}
                  <button
                    type="button"
                    onClick={() => handleCopy(cfg.key, promptObj)}
                    className={`w-full py-2 sm:py-2.5 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 shadow-2xs ${
                      isCopied
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-900 hover:bg-slate-800 text-white"
                    }`}
                    title="Salin JSON prompt ini"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? "Tersalin!" : "Copy JSON"}</span>
                  </button>

                  {/* BUTTON 2: PLAY VOICE OVER */}
                  <button
                    type="button"
                    onClick={() => handleTogglePlayVoiceOver(cfg.key, promptObj)}
                    className={`w-full py-2 sm:py-2.5 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 shadow-2xs ${
                      isCurrentlyPlaying
                        ? "bg-rose-600 hover:bg-rose-700 text-white animate-pulse"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                    }`}
                    title={isCurrentlyPlaying ? "Hentikan Voiceover" : "Putar suara Voiceover 10 detik"}
                  >
                    {isCurrentlyPlaying ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-current" />
                        <span>Stop VO</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Play VO</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Audio Playing Equalizer Wave indicator */}
                {isCurrentlyPlaying && (
                  <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-2 flex items-center justify-between text-xs text-indigo-900">
                    <div className="flex items-center space-x-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-indigo-600 animate-bounce" />
                      <span className="font-bold text-[11px] sm:text-xs">Adegan {activeSceneIdx + 1} / 5</span>
                    </div>
                    <div className="flex items-center space-x-0.5 h-3.5">
                      <span className="w-1 bg-indigo-600 animate-pulse h-2.5"></span>
                      <span className="w-1 bg-indigo-500 animate-pulse h-3.5"></span>
                      <span className="w-1 bg-indigo-700 animate-pulse h-2"></span>
                      <span className="w-1 bg-indigo-600 animate-pulse h-3"></span>
                    </div>
                  </div>
                )}
              </div>

              {/* View Switcher (Scene Cards vs Raw JSON) */}
              <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-100/70 border-b border-slate-200 flex justify-between items-center text-xs">
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {currentView === "cards" ? "5 Adegan (2s/Adegan)" : "Raw JSON"}
                </span>
                <div className="flex bg-white rounded-lg p-0.5 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setViewModes((prev) => ({ ...prev, [cfg.key]: "cards" }))}
                    className={`px-2 py-0.5 rounded-md font-semibold text-[10px] sm:text-[11px] transition ${
                      currentView === "cards" ? "bg-indigo-600 text-white" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Adegan
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewModes((prev) => ({ ...prev, [cfg.key]: "json" }))}
                    className={`px-2 py-0.5 rounded-md font-semibold text-[10px] sm:text-[11px] transition ${
                      currentView === "json" ? "bg-indigo-600 text-white" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    JSON
                  </button>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-3 sm:p-4 flex-grow space-y-2.5 sm:space-y-3 overflow-y-auto max-h-[520px] custom-scrollbar">
                {currentView === "cards" ? (
                  <div className="space-y-2.5 sm:space-y-3">
                    {(promptObj.story || promptObj.scenes || []).map((scene, idx) => {
                      const isSceneActive = isCurrentlyPlaying && activeSceneIdx === idx;
                      const spokenVo = scene.voice_over || scene.vo || "";
                      const wordCount = scene.words || spokenVo.trim().split(/\s+/).filter(Boolean).length;
                      const isWordCountValid = wordCount >= 6 && wordCount <= 8;

                      return (
                        <div
                          key={idx}
                          className={`p-2.5 sm:p-3 rounded-xl border transition-all ${
                            isSceneActive
                              ? "bg-indigo-50 border-indigo-400 ring-2 ring-indigo-200 shadow-xs"
                              : "bg-slate-50/70 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] font-mono font-bold text-indigo-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                              {scene.time}
                            </span>
                            <div className="flex items-center space-x-1">
                              <span
                                className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                  isWordCountValid
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-amber-100 text-amber-800"
                                }`}
                              >
                                {wordCount} kata {isWordCountValid ? "✓" : ""}
                              </span>
                            </div>
                          </div>

                          {/* Spoken Voiceover */}
                          <div className="space-y-0.5 mb-1.5">
                            <div className="text-[9px] sm:text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                              VO (Jawa 18th):
                            </div>
                            <p className="text-[11px] sm:text-xs font-bold text-slate-900 italic bg-white p-2 rounded-lg border border-slate-200 leading-snug">
                              "{spokenVo}"
                            </p>
                          </div>

                          {/* Visual Camera Action */}
                          <div className="space-y-0.5">
                            <div className="text-[9px] sm:text-[10px] font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1">
                              <Film className="w-3 h-3 text-slate-400" />
                              Visual Footage (Clean):
                            </div>
                            <p className="text-[10px] sm:text-[11px] text-slate-600 leading-relaxed pl-0.5">
                              {scene.visual}
                            </p>
                          </div>
                        </div>
                      );
                    })}

                    {/* CTA Status Banner */}
                    <div className="p-2 sm:p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs flex items-center justify-between">
                      <span className="font-bold text-slate-700 text-[11px]">Status CTA:</span>
                      <span
                        className={`font-semibold px-2 py-0.5 rounded text-[10px] sm:text-[11px] ${
                          cfg.key === "VIDEO_PROMPT_3"
                            ? "bg-emerald-100 text-emerald-800 font-bold"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {promptObj.cta || cfg.ctaExpected}
                      </span>
                    </div>
                  </div>
                ) : (
                  /* RAW JSON VIEW */
                  <div className="space-y-2">
                    <pre className="bg-slate-950 text-emerald-400 p-3 rounded-xl text-[10px] sm:text-[11px] font-mono overflow-x-auto leading-relaxed max-h-[460px] custom-scrollbar border border-slate-800">
                      {jsonPayload}
                    </pre>
                  </div>
                )}
              </div>

              {/* Column Footer */}
              <div className="p-2.5 sm:p-3 bg-slate-50 border-t border-slate-200 text-center">
                <button
                  type="button"
                  onClick={() => handleCopy(cfg.key, promptObj)}
                  className="text-xs text-indigo-600 font-bold hover:underline flex items-center justify-center space-x-1 mx-auto"
                >
                  <Copy className="w-3 h-3" />
                  <span>Salin JSON Babak Ini</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
