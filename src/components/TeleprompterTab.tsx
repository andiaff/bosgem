import React, { useState, useEffect, useRef } from "react";
import { CampaignPrompts } from "../types";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Eye, Video, FlipHorizontal, Type } from "lucide-react";

interface TeleprompterTabProps {
  campaign: CampaignPrompts;
}

export const TeleprompterTab: React.FC<TeleprompterTabProps> = ({ campaign }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<0.8 | 1.0 | 1.25>(1.0);
  const [isMirrored, setIsMirrored] = useState(false);
  const [fontSize, setFontSize] = useState<"normal" | "large" | "xlarge">("large");
  const [audioSpeechEnabled, setAudioSpeechEnabled] = useState(false);

  const lastSpokenSceneRef = useRef<number | null>(null);

  // Collect all 15 scenes across the 3 prompts
  const allScenes = [
    ...campaign.VIDEO_PROMPT_1.scenes.map((s, idx) => ({ ...s, promptId: 1, sceneIndex: idx, promptTitle: campaign.VIDEO_PROMPT_1.prompt_type })),
    ...campaign.VIDEO_PROMPT_2.scenes.map((s, idx) => ({ ...s, promptId: 2, sceneIndex: idx, promptTitle: campaign.VIDEO_PROMPT_2.prompt_type })),
    ...campaign.VIDEO_PROMPT_3.scenes.map((s, idx) => ({ ...s, promptId: 3, sceneIndex: idx, promptTitle: campaign.VIDEO_PROMPT_3.prompt_type })),
  ];

  // Timer interval for playback
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackTime((prev) => {
          const next = prev + 0.1 * playbackSpeed;
          if (next >= 30) {
            setIsPlaying(false);
            return 30;
          }
          return next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  // Current active scene index (0 to 14)
  const currentSceneIndex = Math.min(Math.floor(playbackTime / 2), 14);
  const activeScene = allScenes[currentSceneIndex] || allScenes[0];

  // Optional Web Speech API synthesis for Indonesian voice
  useEffect(() => {
    if (isPlaying && audioSpeechEnabled && typeof window !== "undefined" && "speechSynthesis" in window) {
      if (lastSpokenSceneRef.current !== currentSceneIndex) {
        lastSpokenSceneRef.current = currentSceneIndex;
        window.speechSynthesis.cancel(); // Stop any pending speech
        const utterance = new SpeechSynthesisUtterance(activeScene.vo);
        utterance.lang = "id-ID";
        utterance.rate = playbackSpeed * 1.15; // fast TikTok affiliate tempo
        window.speechSynthesis.speak(utterance);
      }
    }
  }, [isPlaying, currentSceneIndex, audioSpeechEnabled, activeScene.vo, playbackSpeed]);

  const handlePlayPause = () => {
    if (playbackTime >= 30) {
      setPlaybackTime(0);
      lastSpokenSceneRef.current = null;
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setPlaybackTime(0);
    lastSpokenSceneRef.current = null;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleJumpToScene = (globalIdx: number) => {
    const targetSec = globalIdx * 2;
    setPlaybackTime(targetSec);
    lastSpokenSceneRef.current = globalIdx;
  };

  // Font sizing styles
  const fontClass =
    fontSize === "normal"
      ? "text-base sm:text-lg"
      : fontSize === "large"
      ? "text-lg sm:text-2xl"
      : "text-2xl sm:text-3xl";

  const progressPercent = (playbackTime / 30) * 100;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider">
          <Eye className="w-4 h-4" />
          <span>Teleprompter Studio & Pemutar Naskah 30-Detik</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Simulasi Pemutaran Video & Voiceover Real-time</h2>
            <p className="text-slate-600 text-sm leading-relaxed max-w-3xl mt-1">
              Gunakan simulator ini saat latihan *voiceover* atau saat pengambilan gambar (*shooting*).
              Naskah akan bergerak per durasi adegan 2 detik untuk memastikan kata yang diucapkan tidak terpotong.
            </p>
          </div>
        </div>
      </div>

      {/* Main Studio Dark Player */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-800/80 pb-5">
          <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-start">
            <span
              className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider transition ${
                isPlaying
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : playbackTime >= 30
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                  : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
              }`}
            >
              {isPlaying ? "● Sedang Memutar" : playbackTime >= 30 ? "✓ Selesai (30s)" : "Siap Diputar"}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Kecepatan: <strong className="text-white">{playbackSpeed}x</strong>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handlePlayPause}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center space-x-2 transition shadow-lg ${
                isPlaying
                  ? "bg-amber-600 hover:bg-amber-500 text-white"
                  : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30"
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? "Jeda" : playbackTime >= 30 ? "Putar Ulang (30s)" : "Mulai Putar (30s)"}</span>
            </button>

            <button
              onClick={handleReset}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold transition flex items-center space-x-1.5"
              title="Reset ke awal"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            {/* Speed Selector */}
            <div className="bg-slate-800 rounded-xl p-1 flex items-center border border-slate-700 text-xs font-semibold">
              {([0.8, 1.0, 1.25] as const).map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2 py-1 rounded-lg transition ${
                    playbackSpeed === spd ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            {/* Mirror Toggle */}
            <button
              onClick={() => setIsMirrored(!isMirrored)}
              className={`p-2.5 rounded-xl text-xs transition border ${
                isMirrored
                  ? "bg-indigo-600 text-white border-indigo-500"
                  : "bg-slate-800 text-slate-300 border-slate-700 hover:text-white"
              }`}
              title="Mode Cermin Teleprompter (Mirror Flip)"
            >
              <FlipHorizontal className="w-4 h-4" />
            </button>

            {/* Font Size Toggle */}
            <div className="bg-slate-800 rounded-xl p-1 flex items-center border border-slate-700 text-xs font-semibold">
              <Type className="w-3.5 h-3.5 text-slate-400 ml-1 mr-0.5" />
              {(["normal", "large", "xlarge"] as const).map((sz) => (
                <button
                  key={sz}
                  onClick={() => setFontSize(sz)}
                  className={`px-1.5 py-1 rounded-md capitalize transition ${
                    fontSize === sz ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {sz === "normal" ? "A" : sz === "large" ? "A+" : "A++"}
                </button>
              ))}
            </div>

            {/* TTS Speech Toggle */}
            <button
              onClick={() => {
                const next = !audioSpeechEnabled;
                setAudioSpeechEnabled(next);
                if (!next && typeof window !== "undefined" && "speechSynthesis" in window) {
                  window.speechSynthesis.cancel();
                }
              }}
              className={`p-2.5 rounded-xl text-xs transition border ${
                audioSpeechEnabled
                  ? "bg-emerald-600 text-white border-emerald-500"
                  : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
              }`}
              title="Aktifkan Suara Bacaan Simulasi (Web Speech AI)"
            >
              {audioSpeechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Big Timer and Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-end text-sm">
            <div className="font-mono flex items-baseline gap-2">
              <span className="text-slate-400 text-xs font-sans uppercase tracking-wider">Waktu Pemutaran:</span>
              <span className="text-amber-400 font-extrabold text-2xl sm:text-3xl">
                {playbackTime.toFixed(1)}s
              </span>
              <span className="text-slate-500 text-sm">/ 30.0s</span>
            </div>
            <div className="text-right">
              <span className="text-xs bg-slate-800 text-indigo-300 font-semibold px-3 py-1 rounded-full border border-slate-700">
                Prompt {activeScene.promptId} • Adegan {activeScene.sceneIndex + 1} ({activeScene.time})
              </span>
            </div>
          </div>

          <div className="w-full bg-slate-900 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              style={{ width: `${progressPercent}%` }}
              className="bg-gradient-to-r from-indigo-500 via-amber-500 to-rose-500 h-full rounded-full transition-all duration-100"
            />
          </div>
        </div>

        {/* Dual Screen Display (Visual Instructions vs Teleprompter VO) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          {/* Left: Camera & Visual Cue (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-indigo-400 font-bold uppercase tracking-wider border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5">
                <Video className="w-4 h-4" />
                Instruksi Visual & Kamera
              </span>
              <span className="text-slate-400 text-[11px]">{activeScene.promptTitle}</span>
            </div>
            <p className="text-slate-200 text-sm leading-relaxed min-h-[90px] font-medium bg-slate-950/60 p-4 rounded-xl border border-slate-800/70">
              {activeScene.visual}
            </p>
            <div className="text-[11px] text-slate-500 flex justify-between pt-1">
              <span>Durasi klip: 2 Detik</span>
              <span>Footage: Raw 100% Bersih</span>
            </div>
          </div>

          {/* Right: Teleprompter Spoken Text (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-amber-400 font-bold uppercase tracking-wider border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5">
                <span className="text-sm">🎙️</span>
                Naskah Suara (Teleprompter VO)
              </span>
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded font-mono text-[11px]">
                {activeScene.words} Kata
              </span>
            </div>

            <div
              className={`p-5 rounded-xl bg-slate-950/80 border border-slate-800 min-h-[90px] flex items-center ${
                isMirrored ? "scale-x-[-1]" : ""
              }`}
            >
              <p
                className={`${fontClass} font-extrabold text-amber-300 leading-snug tracking-wide transition-all duration-150`}
              >
                "{activeScene.vo}"
              </p>
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
              <span>Karakter: Wanita 18 th (Logat Jawa Timur)</span>
              <span className="text-emerald-400 font-semibold">
                {activeScene.words >= 6 && activeScene.words <= 8 ? "✓ Ritme 6-8 Kata Pas" : "⚠️ Sesuaikan ritme"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 15-Scene Interactive Timeline Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Matriks 15 Klip Adegan (Klik untuk Lompat ke Waktu)</h3>
            <p className="text-xs text-slate-500">Pilih adegan manapun untuk langsung menguji naskah dan durasi</p>
          </div>
          <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg font-mono">
            30s Total
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {allScenes.map((sc, index) => {
            const startSec = index * 2;
            const endSec = startSec + 2;
            const isActive = index === currentSceneIndex;

            return (
              <div
                key={index}
                onClick={() => handleJumpToScene(index)}
                className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all space-y-1.5 ${
                  isActive
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-300"
                    : "bg-slate-50 border-slate-200 hover:bg-indigo-50/70 hover:border-indigo-200 text-slate-800"
                }`}
              >
                <div className="flex justify-between items-center font-bold">
                  <span className={isActive ? "text-indigo-100" : "text-indigo-700 font-semibold"}>
                    P{sc.promptId} • S{sc.sceneIndex + 1} ({startSec}-{endSec}s)
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded font-mono text-[10px] ${
                      isActive ? "bg-indigo-800 text-white" : "bg-indigo-100 text-indigo-800"
                    }`}
                  >
                    {sc.words} Kata
                  </span>
                </div>
                <p className={`font-semibold line-clamp-2 leading-relaxed ${isActive ? "text-amber-200" : "text-slate-800"}`}>
                  "{sc.vo}"
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
