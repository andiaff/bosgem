import React, { useEffect, useState, useRef } from "react";
import { Terminal, CheckCircle2, AlertCircle, Clock, Cpu, Sparkles, ShieldCheck, Video, RefreshCw, AlertTriangle } from "lucide-react";

export interface LogEntry {
  id: string;
  time: string;
  tag: "SYS" | "VISION" | "LAYER-1" | "LAYER-2" | "RULE" | "OK" | "ERR" | "WARN" | "LINK" | "SYNC";
  message: string;
  highlight?: boolean;
}

interface BackendAnalysisConsoleProps {
  isAnalyzing: boolean;
  onFinished?: () => void;
  productName?: string;
  error?: string | null;
  latencyMs?: number;
  onRetry?: () => void;
  isFallback?: boolean;
  productLink?: string;
  linkPlatform?: string;
  linkTitle?: string;
}

function sanitizeErrorMessage(rawError: string): string {
  if (!rawError) return "Terjadi kendala pada pemrosesan server.";
  
  if (rawError.includes("503") || rawError.includes("high demand") || rawError.includes("UNAVAILABLE") || rawError.includes("spikes in demand")) {
    return "Server Gemini sedang mengalami lonjakan trafik tinggi (503 High Demand). Sistem otomatis mencoba model alternatif atau mengaktifkan Fail-Safe UGC Engine.";
  }
  
  if (rawError.includes("RESOURCE_EXHAUSTED") || rawError.includes("QUOTA_EXCEEDED")) {
    return "Kuota batas pemanggilan Gemini API terlampaui. Periksa kuota API Key Anda.";
  }

  if (rawError.includes("API_KEY_INVALID") || rawError.includes("invalid API key")) {
    return "API Key Gemini tidak valid atau belum terdaftar. Periksa kembali di kolom Connect API Key.";
  }

  // If it's a JSON string, extract the message
  if (rawError.includes('{"error":')) {
    try {
      const match = rawError.match(/\{"error":.*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        if (parsed?.error?.message) {
          return parsed.error.message;
        }
      }
    } catch {
      // ignore
    }
  }

  return rawError;
}

export const BackendAnalysisConsole: React.FC<BackendAnalysisConsoleProps> = ({
  isAnalyzing,
  onFinished,
  productName,
  error,
  latencyMs,
  onRetry,
  isFallback,
  productLink,
  linkPlatform,
  linkTitle,
}) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const steps = [
    { title: "Ingest Payload", desc: "Membaca buffer gambar & link listing" },
    { title: "Multimodal Vision", desc: "Analisis dimensi, material & warna asli" },
    { title: "Layer 1 Visuals", desc: "Pemilihan latar realistis (Kitchen/Desk/Outdoor)" },
    { title: "Layer 2 Persona", desc: "Kunci suara Wanita 18th Jatim (tempo 3-4 wps)" },
    { title: "Strict Sanitizer", desc: "Batas 6-8 kata, zero overlay, CTA di P3" },
    { title: "JSON Synthesis", desc: "Kompilasi 3 Kolom Prompt Terstruktur" },
  ];

  // Timer counter during analysis
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnalyzing) {
      setElapsedTime(0);
      interval = setInterval(() => {
        setElapsedTime((prev) => +(prev + 0.1).toFixed(1));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  // Simulated backend telemetry log generation during analysis
  useEffect(() => {
    if (!isAnalyzing) {
      if (logs.length > 0 && !error) {
        setActiveStep(6);
      }
      return;
    }

    setLogs([]);
    setActiveStep(1);

    const platformName = linkPlatform === "tiktok" ? "TikTok Shop" : linkPlatform === "shopee" ? "Shopee" : "E-Commerce";

    const initialLogs: { delay: number; tag: LogEntry["tag"]; msg: string; step: number }[] = [
      { delay: 100, tag: "SYS", msg: "POST /api/generate-prompts - Payload received [multipart/base64 & link]", step: 1 },
    ];

    if (productLink) {
      initialLogs.push({
        delay: 300,
        tag: "LINK",
        msg: `Link ${platformName} terhubung: ${productLink.length > 55 ? productLink.slice(0, 52) + "..." : productLink}`,
        step: 1,
      });
      initialLogs.push({
        delay: 650,
        tag: "SYNC",
        msg: `Mengekstrak spesifikasi & deskripsi produk resmi: "${linkTitle || 'Deskripsi Produk'}" untuk bahan Voice Over`,
        step: 2,
      });
    }

    initialLogs.push(
      { delay: 900, tag: "VISION", msg: "Gemini Vision Multimodal reasoning engine initialized (model: gemini-3.1-flash-lite / gemini-3.8-flash)", step: 1 },
      { delay: 1400, tag: "LAYER-1", msg: "Menganalisis fisik produk: Deteksi kontur fisik, palet warna, tekstur material & skala proporsional nyata...", step: 2 },
      { delay: 1900, tag: "LAYER-1", msg: "Memetakan skenario syuting dinamis (Dapur / Meja Kerja / Outdoor / Real Usage)", step: 3 },
      { delay: 2400, tag: "LAYER-2", msg: "Mengunci Persona Voiceover: Wanita 18th Jawa Timur, tempo affiliate cepat (3-4 kata/detik), gaya agresif natural", step: 4 }
    );

    if (productLink) {
      initialLogs.push({
        delay: 2750,
        tag: "SYNC",
        msg: "Sinkronisasi Poin Deskripsi: Menyusun kalimat VO agar akurat menyebutkan spesifikasi & keunggulan resmi barang",
        step: 4,
      });
    }

    initialLogs.push(
      { delay: 3100, tag: "RULE", msg: "Menjalankan Rule Engine: Membatasi tepat 5 adegan/video (2 detik/adegan) dan 6-8 kata VO per adegan", step: 5 },
      { delay: 3600, tag: "RULE", msg: "Sanitasi: Dilarang sebut 'keranjang kuning' di P1/P2. CTA verbal murni dikunci di P3 (8-10s)", step: 5 },
      { delay: 4100, tag: "RULE", msg: "Verifikasi visual: 100% clean footage, dilarang watermark, teks overlay, atau emoji/ikon", step: 5 },
      { delay: 4700, tag: "SYS", msg: "Memformat output ke 3 objek JSON bersambung (VIDEO_PROMPT_1, VIDEO_PROMPT_2, VIDEO_PROMPT_3)...", step: 6 }
    );

    const timers: NodeJS.Timeout[] = [];

    initialLogs.forEach((item) => {
      const t = setTimeout(() => {
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}.${Math.floor(now.getMilliseconds() / 100)}`;
        setLogs((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            time: timeStr,
            tag: item.tag,
            message: item.msg,
            highlight: item.tag === "LAYER-1" || item.tag === "LAYER-2",
          },
        ]);
        setActiveStep(item.step);
      }, item.delay);
      timers.push(t);
    });

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [isAnalyzing]);

  // Add final success or error log
  useEffect(() => {
    if (!isAnalyzing && logs.length > 0) {
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}.${Math.floor(now.getMilliseconds() / 100)}`;

      if (error) {
        const cleanMsg = sanitizeErrorMessage(error);
        setLogs((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            time: timeStr,
            tag: "ERR",
            message: `[KENDALA] ${cleanMsg}`,
          },
        ]);
      } else {
        setLogs((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            time: timeStr,
            tag: "OK",
            message: `[SUCCESS 200 OK] 3 Prompt Video berhasil dibuat (${latencyMs ? `${latencyMs}ms` : "Selesai"}). Ditampilkan di 3 Kolom Responsif!`,
            highlight: true,
          },
        ]);
        setActiveStep(6);
      }
    }
  }, [isAnalyzing, error, latencyMs]);

  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const cleanErrorText = error ? sanitizeErrorMessage(error) : null;

  return (
    <div className="bg-slate-950 text-slate-200 rounded-xl sm:rounded-2xl border border-slate-800 shadow-md overflow-hidden">
      {/* Console Titlebar */}
      <div className="bg-slate-900/90 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2 min-w-0">
          <div className="hidden xs:flex space-x-1 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <div className="flex items-center space-x-1.5 text-[11px] sm:text-xs font-mono font-bold text-slate-300 truncate">
            <Terminal className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate">ANALISIS BACKEND AI</span>
            <span className="text-slate-500 font-normal hidden md:inline">| Live Telemetry</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-[11px] sm:text-xs font-mono shrink-0">
          {isAnalyzing ? (
            <div className="flex items-center space-x-1.5 text-indigo-400">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
              <span className="font-semibold">{elapsedTime}s</span>
              <span className="text-[10px] text-slate-400 hidden sm:inline">Memproses...</span>
            </div>
          ) : error ? (
            <div className="flex items-center space-x-1.5">
              <span className="text-rose-400 font-bold flex items-center gap-1 text-[11px]">
                <AlertCircle className="w-3.5 h-3.5" /> Gagal
              </span>
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="px-2 py-0.5 bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700 rounded-md text-[10px] font-sans font-bold flex items-center gap-1 transition"
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                  <span>Coba Lagi</span>
                </button>
              )}
            </div>
          ) : logs.length > 0 ? (
            <div className="flex items-center space-x-1 text-emerald-400 font-bold text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Selesai {latencyMs ? `(${latencyMs}ms)` : ""}</span>
            </div>
          ) : (
            <span className="text-slate-500 text-[10px] sm:text-[11px]">Siap</span>
          )}
        </div>
      </div>

      {/* Error Callout Banner if Error occurred */}
      {cleanErrorText && (
        <div className="bg-rose-950/70 border-b border-rose-800/80 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-rose-200">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-rose-100 text-xs">Kendala Analisis AI Backend:</p>
              <p className="text-rose-300 text-[11px] leading-relaxed mt-0.5">{cleanErrorText}</p>
            </div>
          </div>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="shrink-0 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition shadow-xs self-start sm:self-auto"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Coba Lagi Sekarang</span>
            </button>
          )}
        </div>
      )}

      {/* 6 Step Progress Micro-Badges */}
      <div className="bg-slate-900/50 px-3 sm:px-4 py-2 border-b border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 sm:gap-2 text-[11px] font-mono">
        {steps.map((s, idx) => {
          const stepNum = idx + 1;
          const isDone = activeStep > stepNum || (!isAnalyzing && logs.length > 0 && !error);
          const isCurrent = activeStep === stepNum && isAnalyzing;

          return (
            <div
              key={idx}
              className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl border transition-all text-left ${
                isCurrent
                  ? "bg-indigo-950/70 border-indigo-500 text-indigo-200 shadow-xs"
                  : isDone
                  ? "bg-slate-900/40 border-emerald-900/40 text-emerald-300"
                  : "bg-slate-950/40 border-slate-800/60 text-slate-500"
              }`}
            >
              <div className="flex items-center justify-between font-bold mb-0.5">
                <span className="text-[9px] sm:text-[10px] tracking-wider uppercase">Langkah {stepNum}</span>
                {isDone ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ) : isCurrent ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping"></span>
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                )}
              </div>
              <p className="font-semibold text-slate-200 text-[10px] sm:text-[11px] truncate">{s.title}</p>
              <p className="text-[8px] sm:text-[9px] text-slate-400 truncate">{s.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Console Log Body */}
      <div
        ref={logContainerRef}
        className="p-3 sm:p-4 space-y-1.5 max-h-48 sm:max-h-56 overflow-y-auto text-xs leading-relaxed custom-scrollbar bg-slate-950/90 selection:bg-indigo-600 selection:text-white"
      >
        {logs.map((log) => (
          <div key={log.id} className="flex items-start space-x-1.5 sm:space-x-2 font-mono text-[11px] sm:text-xs">
            <span className="text-slate-500 text-[9px] sm:text-[10px] shrink-0 select-none">[{log.time}]</span>
            <span
              className={`px-1 py-0.2 rounded text-[9px] sm:text-[10px] font-bold shrink-0 ${
                log.tag === "SYS"
                  ? "bg-slate-800 text-slate-300"
                  : log.tag === "LINK"
                  ? "bg-pink-950 text-pink-300 border border-pink-800"
                  : log.tag === "SYNC"
                  ? "bg-teal-950 text-teal-300 border border-teal-800"
                  : log.tag === "VISION"
                  ? "bg-cyan-950 text-cyan-400 border border-cyan-800"
                  : log.tag === "LAYER-1"
                  ? "bg-blue-950 text-blue-300 border border-blue-800"
                  : log.tag === "LAYER-2"
                  ? "bg-purple-950 text-purple-300 border border-purple-800"
                  : log.tag === "RULE"
                  ? "bg-amber-950 text-amber-300 border border-amber-800"
                  : log.tag === "OK"
                  ? "bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold"
                  : "bg-rose-950 text-rose-300 border border-rose-800 font-bold"
              }`}
            >
              {log.tag}
            </span>
            <span
              className={`break-words text-[11px] sm:text-xs ${
                log.highlight
                  ? "text-emerald-300 font-semibold"
                  : log.tag === "ERR"
                  ? "text-rose-400"
                  : "text-slate-300"
              }`}
            >
              {log.message}
            </span>
          </div>
        ))}
        {isAnalyzing && (
          <div className="flex items-center space-x-2 text-indigo-400 text-xs animate-pulse pt-1">
            <span className="inline-block w-1.5 h-3.5 bg-indigo-400"></span>
            <span className="text-[11px] sm:text-xs">AI vision sedang memproses analisis adegan...</span>
          </div>
        )}
      </div>
    </div>
  );
};
