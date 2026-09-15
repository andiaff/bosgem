import React, { useState } from "react";
import { Key, CheckCircle2, XCircle, RefreshCw, Eye, EyeOff, ShieldCheck, Zap, Server, ChevronDown, ChevronUp } from "lucide-react";

export interface ApiKeyStatus {
  state: "idle" | "testing" | "success" | "failed";
  message?: string;
  latencyMs?: number;
  model?: string;
  timestamp?: string;
}

interface ApiKeyConnectorProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  onStatusChange?: (status: ApiKeyStatus) => void;
}

export const ApiKeyConnector: React.FC<ApiKeyConnectorProps> = ({
  apiKey,
  onApiKeyChange,
  onStatusChange,
}) => {
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<ApiKeyStatus>(() => {
    const cached = localStorage.getItem("gemini_api_status");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        return { state: "idle" };
      }
    }
    return { state: "idle" };
  });

  // Test connection function
  const handleTestConnection = async (overrideKey?: string) => {
    const keyToTest = overrideKey !== undefined ? overrideKey : apiKey;
    setIsTesting(true);
    setStatus({ state: "testing", message: "Sedang menguji komunikasi dengan Gemini 3.8 Flash..." });

    try {
      const response = await fetch("/api/test-api-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: keyToTest }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const newStatus: ApiKeyStatus = {
          state: "success",
          message: data.message || "API Key aktif dan siap digunakan!",
          latencyMs: data.latencyMs,
          model: data.model || "gemini-3.8-flash",
          timestamp: data.timestamp || new Date().toLocaleTimeString("id-ID"),
        };
        setStatus(newStatus);
        localStorage.setItem("gemini_api_status", JSON.stringify(newStatus));
        if (onStatusChange) onStatusChange(newStatus);
      } else {
        const newStatus: ApiKeyStatus = {
          state: "failed",
          message: data.error || "Koneksi API Key gagal. Periksa kembali kunci API Anda.",
          latencyMs: data.latencyMs,
          timestamp: data.timestamp || new Date().toLocaleTimeString("id-ID"),
        };
        setStatus(newStatus);
        localStorage.setItem("gemini_api_status", JSON.stringify(newStatus));
        if (onStatusChange) onStatusChange(newStatus);
      }
    } catch (err: any) {
      const newStatus: ApiKeyStatus = {
        state: "failed",
        message: err?.message || "Tidak dapat terhubung ke server backend.",
      };
      setStatus(newStatus);
      if (onStatusChange) onStatusChange(newStatus);
    } finally {
      setIsTesting(false);
    }
  };

  const handleUseServerDefault = () => {
    onApiKeyChange("");
    localStorage.removeItem("custom_gemini_api_key");
    handleTestConnection("");
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs p-3.5 sm:p-5 space-y-3">
      {/* Header and status badge */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
            <Key className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5 truncate">
              <span>API Key Gemini</span>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded shrink-0">
                gemini-3.8-flash
              </span>
            </h3>
            <p className="text-[10px] sm:text-xs text-slate-500 truncate hidden sm:block">
              Default server environment aktif atau gunakan custom key Anda
            </p>
          </div>
        </div>

        {/* Status Badge + Toggle */}
        <div className="flex items-center gap-1.5 shrink-0">
          {status.state === "success" && (
            <div className="inline-flex items-center space-x-1.5 px-2 sm:px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 text-[10px] sm:text-xs font-bold">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span className="hidden xs:inline">Aktif</span>
              {status.latencyMs !== undefined && (
                <span className="text-[9px] sm:text-[10px] px-1 bg-emerald-100 text-emerald-800 rounded font-mono">
                  {status.latencyMs}ms
                </span>
              )}
            </div>
          )}

          {status.state === "failed" && (
            <div className="inline-flex items-center space-x-1 px-2 sm:px-2.5 py-1 rounded-full bg-rose-50 border border-rose-300 text-rose-700 text-[10px] sm:text-xs font-bold">
              <XCircle className="w-3 h-3 text-rose-600" />
              <span>Gagal</span>
            </div>
          )}

          {status.state === "testing" && (
            <div className="inline-flex items-center space-x-1 px-2 sm:px-2.5 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-700 text-[10px] sm:text-xs font-bold">
              <RefreshCw className="w-3 h-3 animate-spin text-amber-600" />
              <span className="hidden xs:inline">Menguji...</span>
            </div>
          )}

          {status.state === "idle" && (
            <div className="inline-flex items-center space-x-1 px-2 sm:px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[10px] sm:text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Siap (Default)</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 sm:p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
            title={isOpen ? "Tutup Pengaturan API Key" : "Ubah / Atur API Key"}
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Collapsible Input Box and Action Controls */}
      {isOpen && (
        <div className="pt-2 border-t border-slate-100 space-y-2.5 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
            <div className="relative flex-grow">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => {
                  const val = e.target.value;
                  onApiKeyChange(val);
                  localStorage.setItem("custom_gemini_api_key", val);
                }}
                placeholder="Kosongkan untuk default server, atau tempel AIzaSy..."
                className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition p-1"
                title={showKey ? "Sembunyikan Key" : "Tampilkan Key"}
              >
                {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => handleTestConnection()}
                disabled={isTesting}
                className="flex-1 sm:flex-initial py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1 shadow-xs disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                {isTesting ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Menguji...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3 h-3 text-amber-300" />
                    <span>Uji Koneksi</span>
                  </>
                )}
              </button>

              {apiKey && (
                <button
                  type="button"
                  onClick={handleUseServerDefault}
                  className="py-2 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center space-x-1"
                  title="Reset ke Default Server Key"
                >
                  <Server className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-[11px]">Default</span>
                </button>
              )}
            </div>
          </div>

          {/* Indicator Detail Message */}
          {status.message && (
            <div
              className={`text-xs p-2.5 rounded-xl flex items-start space-x-2 transition ${
                status.state === "success"
                  ? "bg-emerald-50/80 text-emerald-800 border border-emerald-200"
                  : status.state === "failed"
                  ? "bg-rose-50/80 text-rose-800 border border-rose-200"
                  : "bg-slate-50 text-slate-600 border border-slate-200"
              }`}
            >
              {status.state === "success" && <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
              {status.state === "failed" && <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
              <div className="space-y-0.5">
                <p className="font-semibold text-[11px] sm:text-xs">{status.message}</p>
                {status.timestamp && (
                  <p className="text-[10px] opacity-80">
                    Dicek: {status.timestamp} • Mode: {apiKey ? "Custom Key" : "Default Server"}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
