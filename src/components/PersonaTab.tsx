import React, { useState } from "react";
import { Mic, CheckCircle2, AlertTriangle, XCircle, Info, Sparkles } from "lucide-react";
import { DEFAULT_LOCKED_VOICEOVER } from "../data/defaultData";

export const PersonaTab: React.FC = () => {
  const [inputText, setInputText] = useState("Sumpah rek, aku kaget banget nemu ginian di rumah!");

  // Analysis calculation
  const wordsArray = inputText.trim() ? inputText.trim().split(/\s+/).filter(Boolean) : [];
  const wordCount = wordsArray.length;
  const estimatedSeconds = (wordCount / 3.5).toFixed(1);

  // Status determinations
  const isIdeal = wordCount >= 6 && wordCount <= 8;
  const isTooShort = wordCount > 0 && wordCount < 6;
  const isTooLong = wordCount > 8;

  const barPercent = Math.min((wordCount / 10) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider">
          <Mic className="w-4 h-4" />
          <span>Spesifikasi Karakter Suara & Cek Durasi Klip 2-Detik</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Persona Pengisi Suara & Kalkulator Batas Kata</h2>
          <p className="text-slate-600 text-sm leading-relaxed max-w-3xl mt-1">
            Karakter suara (Persona) adalah identitas terkunci untuk seluruh 3 video agar penonton merasakan kontinuitas kreator yang sama.
            Gunakan penguji kata di bawah ini untuk memastikan kalimat naskah Anda muat tepat dalam durasi adegan 2 detik (maksimal 6-8 kata).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Persona Profile Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <span>Profil Karakter Suara</span>
              </h3>
              <span className="text-[11px] font-bold px-2 py-0.5 bg-rose-50 text-rose-700 rounded-md border border-rose-200 uppercase">
                Terkunci (LOCKED)
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Demografi & Aksen:</span>
                <span className="font-bold text-slate-900">{DEFAULT_LOCKED_VOICEOVER.gender_age_accent}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Gaya Penyampaian:</span>
                <span className="font-bold text-slate-900 text-right max-w-[200px]">
                  Hyper-energetic TikTok Affiliate selling
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Target Kecepatan:</span>
                <span className="font-bold text-indigo-700">3 - 4 Kata / Detik</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Imbuhan Khas:</span>
                <span className="font-bold text-indigo-600 font-mono bg-indigo-50 px-2 py-0.5 rounded">
                  "rek", "pol", "tenan"
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Aliran Narasi:</span>
                <span className="font-bold text-slate-900">Zero Dead-Air (Tanpa jeda mati)</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500 font-medium">Kontinuitas:</span>
                <span className="font-bold text-emerald-700">100% Seragam di 3 Video</span>
              </div>
            </div>

            {/* Dialect Guidance */}
            <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1.5">
              <p className="font-bold flex items-center gap-1.5">
                <Info className="w-4 h-4 text-amber-700" />
                Aturan Dialek Jawa-Indonesia:
              </p>
              <p className="leading-relaxed text-[11px] text-amber-800">
                Gunakan Bahasa Indonesia percakapan umum yang mudah dimengerti audiens nasional di seluruh Indonesia.
                Imbuhan logat Jawa seperti <em>"rek"</em>, <em>"pol"</em>, atau <em>"tenan"</em> digunakan sebagai pemanis alami
                dan tidak boleh berlebihan atau mendominasi seluruh kalimat.
              </p>
            </div>
          </div>
        </div>

        {/* Live Word Calculator (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Kalkulator Verifikasi Adegan 2-Detik</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ketikkan kalimat voiceover Anda untuk menguji apakah pas dalam durasi adegan 2 detik tanpa terpotong.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="checker-input" className="font-semibold text-slate-700 uppercase tracking-wider">
                Kalimat Voiceover (Bahasa Indonesia):
              </label>
              <button
                onClick={() => setInputText("")}
                className="text-[11px] text-slate-400 hover:text-slate-600 underline"
              >
                Hapus
              </button>
            </div>
            <textarea
              id="checker-input"
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Contoh: Sumpah rek, aku kaget banget nemu ginian di rumah!"
              className="w-full p-3.5 border border-slate-300 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition resize-none"
            />
          </div>

          {/* Analysis Feedback Block */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-slate-500 font-medium block">Jumlah Kata:</span>
                <span
                  className={`text-2xl font-extrabold ${
                    isIdeal ? "text-emerald-600" : isTooLong ? "text-rose-600" : "text-amber-600"
                  }`}
                >
                  {wordCount} Kata
                </span>
                <span className="text-[11px] text-slate-400 block">Target: 6 - 8 Kata</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium block">Estimasi Durasi Bicara:</span>
                <span className="text-2xl font-extrabold text-slate-900">{estimatedSeconds} Detik</span>
                <span className="text-[11px] text-slate-400 block">Batas Adegan: 2.0 Detik</span>
              </div>
            </div>

            {/* Visual Gauge Bar */}
            <div className="space-y-1.5">
              <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                <div
                  style={{ width: `${barPercent}%` }}
                  className={`h-full transition-all duration-200 ${
                    isIdeal ? "bg-emerald-500" : isTooLong ? "bg-rose-500" : "bg-amber-500"
                  }`}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0 kata</span>
                <span className="text-emerald-600 font-bold">6 - 8 kata (Ideal 2s)</span>
                <span>10+ kata</span>
              </div>
            </div>

            {/* Smart Message */}
            <div
              className={`p-3 rounded-xl text-xs font-semibold flex items-start gap-2 ${
                isIdeal
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : isTooLong
                  ? "bg-rose-50 text-rose-800 border border-rose-200"
                  : "bg-amber-50 text-amber-800 border border-amber-200"
              }`}
            >
              {isIdeal ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Sempurna untuk Adegan 2 Detik!</p>
                    <p className="font-normal text-[11px] text-emerald-700 mt-0.5">
                      Jumlah {wordCount} kata sangat pas dengan kecepatan pengucapan TikTok affiliate (3-4 kata/detik).
                    </p>
                  </div>
                </>
              ) : isTooLong ? (
                <>
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Terlalu Panjang ({wordCount} Kata)!</p>
                    <p className="font-normal text-[11px] text-rose-700 mt-0.5">
                      Kalimat berisiko terpotong atau memaksa kreator bicara terburu-buru. Pangkas kata hingga 6-8 kata.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Agak Pendek ({wordCount} Kata)!</p>
                    <p className="font-normal text-[11px] text-amber-700 mt-0.5">
                      Kurang dari 6 kata berpotensi menimbulkan momen hening (dead-air). Tambahkan detail reaksi atau imbuhan alami.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Quick Examples for Inspiration */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Contoh Kalimat 6 - 8 Kata yang Lolos Verifikasi:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                "Sumpah rek, aku kaget banget nemu ginian!",
                "Barang viral ini kok bisa nyasar di rumahku?",
                "Langsung kita buktiin sekarang juga, tanpa rekayasa!",
                "Loh, kok secepat ini perubahannya? Kaget tenan!",
                "Pantesan tetanggaku pada borong sampai numpuk begini!",
                "Jangan sampai nyesel, buruan amankan stoknya sekarang!",
              ].map((sample, i) => (
                <button
                  key={i}
                  onClick={() => setInputText(sample)}
                  className="text-left p-2.5 bg-slate-50 hover:bg-indigo-50 text-slate-700 rounded-lg border border-slate-200 transition text-[11px] font-medium"
                >
                  "{sample}"
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
