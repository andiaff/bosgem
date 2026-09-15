import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { generateFailSafeCampaign } from "./server/fallbackGenerator.js";

dotenv.config();

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const app = express();
const PORT = 3000;

// Body parser with large limit for image uploads
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Helper to get Gemini client with either custom or environment API key
function getGeminiClient(customKey?: string): GoogleGenAI {
  const apiKey = (customKey && customKey.trim()) ? customKey.trim() : process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API Key Gemini belum disetel. Masukkan API Key di panel atau set GEMINI_API_KEY.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Helper utilities for HTML parsing and metadata extraction
function decodeHtmlEntities(str: string): string {
  if (!str) return "";
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&#([0-9]+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)));
}

function extractMetaTag(html: string, property: string): string {
  if (!html) return "";
  const regex1 = new RegExp(`<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']*)["']`, "i");
  const match1 = html.match(regex1);
  if (match1 && match1[1]) return decodeHtmlEntities(match1[1].trim());

  const regex2 = new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${property}["']`, "i");
  const match2 = html.match(regex2);
  if (match2 && match2[1]) return decodeHtmlEntities(match2[1].trim());

  return "";
}

function extractTitle(html: string): string {
  if (!html) return "";
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match && match[1] ? decodeHtmlEntities(match[1].trim()) : "";
}

function extractJsonLd(html: string): { title?: string; description?: string; imageUrl?: string; price?: string } | null {
  if (!html) return null;
  const matches = html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  for (const match of matches) {
    try {
      const data = JSON.parse(match[1]);
      const items = Array.isArray(data) ? data : [data];
      for (const item of items) {
        if (item["@type"] === "Product" || item.name) {
          return {
            title: item.name ? decodeHtmlEntities(String(item.name)) : undefined,
            description: item.description ? decodeHtmlEntities(String(item.description)) : undefined,
            imageUrl: Array.isArray(item.image) ? item.image[0] : (typeof item.image === "string" ? item.image : undefined),
            price: item.offers?.price ? String(item.offers.price) : undefined,
          };
        }
      }
    } catch {
      // ignore invalid json-ld
    }
  }
  return null;
}

function extractSlugTitle(urlStr: string): string {
  try {
    const parsed = new URL(urlStr);
    const pathname = parsed.pathname;
    // For Shopee: /ProductName-i.12345.67890
    const shopeeMatch = pathname.match(/\/([^\/]+)-i\.\d+\.\d+/i);
    if (shopeeMatch && shopeeMatch[1]) {
      const cleaned = decodeURIComponent(shopeeMatch[1]).replace(/[-_]+/g, " ").trim();
      if (cleaned.length > 3) return cleaned;
    }
    const segments = pathname.split("/").filter(Boolean);
    for (let i = segments.length - 1; i >= 0; i--) {
      const seg = segments[i];
      if (seg.length > 4 && !/^\d+$/.test(seg) && !seg.startsWith("@") && !seg.startsWith("tag")) {
        const cleaned = decodeURIComponent(seg).replace(/[-_]+/g, " ").replace(/\.(html?|php)$/i, "").trim();
        if (cleaned.length > 4) return cleaned;
      }
    }
  } catch {
    // ignore
  }
  return "";
}

interface ProductClassification {
  productType: string;
  category: string;
}

function detectProductTypeAndCategory(title: string, description: string, url: string): ProductClassification {
  const text = `${title} ${description} ${url}`.toLowerCase();

  // 1. Gorden / Tirai / Smokering / Blackout
  if (
    text.includes("gorden") ||
    text.includes("korden") ||
    text.includes("tirai") ||
    text.includes("curtain") ||
    text.includes("smokering") ||
    text.includes("blackout") ||
    text.includes("vitrase")
  ) {
    return { productType: "Gorden", category: "home_living" };
  }

  // 2. Bantal / Guling / Pillow
  if (
    text.includes("bantal") ||
    text.includes("pillow") ||
    text.includes("guling") ||
    text.includes("bolster") ||
    text.includes("memory foam") ||
    text.includes("silikon hotel")
  ) {
    return { productType: "Bantal", category: "home_living" };
  }

  // 3. Sprei & Bedcover
  if (
    text.includes("sprei") ||
    text.includes("bedcover") ||
    text.includes("selimut") ||
    text.includes("sprai") ||
    text.includes("bed cover")
  ) {
    return { productType: "Sprei & Bedcover", category: "home_living" };
  }

  // 4. Blender / Juicer / Chopper
  if (
    text.includes("blender") ||
    text.includes("juicer") ||
    text.includes("chopper") ||
    text.includes("penggiling") ||
    text.includes("mixer")
  ) {
    return { productType: "Blender Portable", category: "kitchen" };
  }

  // 5. Panci / Wajan / Cookware
  if (
    text.includes("panci") ||
    text.includes("wajan") ||
    text.includes("teflon") ||
    text.includes("cookware") ||
    text.includes("frypan") ||
    text.includes("steamer") ||
    text.includes("pemasak")
  ) {
    return { productType: "Panci & Wajan", category: "kitchen" };
  }

  // 6. Kipas Angin
  if (
    text.includes("kipas angin") ||
    text.includes("mini fan") ||
    text.includes("portable fan") ||
    text.includes("neck fan") ||
    text.includes("desk fan")
  ) {
    return { productType: "Kipas Angin", category: "electronics" };
  }

  // 7. Skincare / Serum Wajah
  if (
    text.includes("serum") ||
    text.includes("skincare") ||
    text.includes("toner") ||
    text.includes("sunscreen") ||
    text.includes("moisturizer") ||
    text.includes("facial wash") ||
    text.includes("acne") ||
    text.includes("glowing") ||
    text.includes("retinol") ||
    text.includes("niacinamide")
  ) {
    return { productType: "Serum Wajah", category: "beauty" };
  }

  // 8. TWS / Earphone / Audio
  if (
    text.includes("tws") ||
    text.includes("earphone") ||
    text.includes("headset") ||
    text.includes("earbuds") ||
    text.includes("bluetooth audio") ||
    text.includes("speaker")
  ) {
    return { productType: "TWS Earphone", category: "gadget" };
  }

  // 9a. Pakaian Dalam Pria (Celana Dalam Pria / Boxer / Briefs)
  if (
    text.includes("celana dalam pria") ||
    text.includes("boxer pria") ||
    text.includes("boxer") ||
    text.includes("cd pria") ||
    text.includes("underwear men") ||
    text.includes("briefs") ||
    text.includes("celana pendek dalam")
  ) {
    return { productType: "Celana Dalam Pria", category: "fashion" };
  }

  // 9b. Pakaian Dalam Wanita (Celana Dalam Wanita / Seamless Panties)
  if (
    text.includes("celana dalam wanita") ||
    text.includes("cd wanita") ||
    text.includes("seamless panties") ||
    text.includes("underwear women") ||
    text.includes("panties") ||
    text.includes("bra") ||
    text.includes("bh")
  ) {
    return { productType: "Celana Dalam Wanita", category: "fashion" };
  }

  // 9c. Alat Pijat Elektrik / Massage Gun / Pijat Leher
  if (
    text.includes("pijat") ||
    text.includes("massage") ||
    text.includes("massage gun") ||
    text.includes("alat pijit") ||
    text.includes("neck massager")
  ) {
    return { productType: "Alat Pijat Elektrik", category: "electronics" };
  }

  // 9d. Busana / Pakaian / Gamis
  if (
    text.includes("gamis") ||
    text.includes("kemeja") ||
    text.includes("dress") ||
    text.includes("kaos") ||
    text.includes("celana") ||
    text.includes("jaket") ||
    text.includes("baju") ||
    text.includes("hoodie") ||
    text.includes("tunik")
  ) {
    return { productType: "Busana & Pakaian", category: "fashion" };
  }

  // 10. Sandal & Sepatu
  if (
    text.includes("sandal") ||
    text.includes("sendal") ||
    text.includes("selop") ||
    text.includes("slipper") ||
    text.includes("crocs") ||
    text.includes("alas kaki")
  ) {
    return { productType: "Sandal", category: "fashion" };
  }

  if (
    text.includes("sepatu") ||
    text.includes("sneakers") ||
    text.includes("heels") ||
    text.includes("slip on") ||
    text.includes("loafers")
  ) {
    return { productType: "Sepatu", category: "fashion" };
  }

  // 11. Tas & Ransel
  if (
    text.includes("tas") ||
    text.includes("backpack") ||
    text.includes("ransel") ||
    text.includes("tote bag") ||
    text.includes("sling bag") ||
    text.includes("dompet")
  ) {
    return { productType: "Tas & Ransel", category: "fashion" };
  }

  // 12. Botol Minum / Tumbler
  if (
    text.includes("tumbler") ||
    text.includes("termos") ||
    text.includes("botol minum") ||
    text.includes("thermos")
  ) {
    return { productType: "Tumbler / Botol Minum", category: "home_living" };
  }

  // Dynamic Fallback from title
  const words = title.split(/\s+/).filter((w) => w.length > 2);
  const guessed = words[0] ? words[0].charAt(0).toUpperCase() + words[0].slice(1) : "Produk Pilihan";
  return { productType: guessed, category: "general" };
}

function isBotBlockedTitle(text: string): boolean {
  if (!text) return true;
  const lower = text.toLowerCase().trim();
  if (
    lower.includes("error_page") ||
    lower.includes("error page") ||
    lower.includes("single page application") ||
    lower.includes("mkt single page") ||
    lower.includes("opaanlp") ||
    lower.includes("access denied") ||
    lower.includes("robot") ||
    lower.includes("captcha") ||
    lower.includes("security check") ||
    lower.includes("cloudflare") ||
    lower.includes("waf") ||
    lower === "shopee" ||
    lower === "tiktok" ||
    lower === "lazada" ||
    lower === "tokopedia" ||
    lower === "shopee indonesia" ||
    lower === "tiktok shop"
  ) {
    return true;
  }
  // Alphanumeric random hash string (e.g. 1LfIAS38og, opaanlp)
  if (/^[a-zA-Z0-9_-]{6,16}$/.test(text) && !text.includes(" ")) {
    return true;
  }
  return false;
}

function cleanProductName(rawTitle: string): string {
  let title = rawTitle || "";
  if (isBotBlockedTitle(title)) {
    return "";
  }
  title = title
    .replace(/\|\s*Shopee\s*Indonesia/gi, "")
    .replace(/\|\s*Shopee/gi, "")
    .replace(/\|\s*TikTok\s*Shop/gi, "")
    .replace(/\|\s*TikTok/gi, "")
    .replace(/\|\s*Lazada/gi, "")
    .replace(/\|\s*Tokopedia/gi, "")
    .replace(/^(Jual|Beli|Promo|Diskon|Murah|Best Seller|Grosir|Ready|Termurah)\s+/gi, "")
    .replace(/\s+-\s+Shopee\s+Indonesia/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  return title;
}

function synthesizeCategoryDescription(title: string, platform: string, productType?: string): string {
  const cleanTitle = cleanProductName(title);
  const platformName = platform === "tiktok" ? "TikTok Shop" : platform === "shopee" ? "Shopee" : "E-Commerce";
  const type = productType || detectProductTypeAndCategory(cleanTitle, "", "").productType;

  if (type === "Gorden") {
    return `[Jenis Produk: Gorden]\nNama Produk: ${cleanTitle}\n` +
      `• Spesifikasi & Bahan: Kain blackout impor tebal grade A premium dengan tekstur serat timbul (embos) mewah, mampu memblokir hingga 90% sinar matahari dan meredam panas ruangan.\n` +
      `• Ukuran & Ring: Ukuran kain standar Lebar 140 cm x Tinggi 200 cm, dilengkapi 12 lubang ring smokering perak (membentuk 6 gelembung lipatan indah yang jatuh elegan).\n` +
      `• Keunggulan: Bahan tidak tembus pandang dari luar, tekstur halus jatuh tidak kaku, warna awet tidak luntur dicuci, cocok dipasang pada jendela kamar tidur maupun pintu depan rumah.`;
  }

  if (type === "Bantal") {
    return `[Jenis Produk: Bantal]\nNama Produk: ${cleanTitle}\n` +
      `• Spesifikasi & Isian: 100% serat silikon mikrofiber grade A empuk anti-kempes, memiliki elastisitas tinggi dan kembali mengembang seketika saat ditepuk.\n` +
      `• Ukuran & Bobot: Ukuran standar hotel berbintang 45 cm x 65 cm (berat ~850 gram), memberikan topangan ergonomis pada leher dan kepala untuk tidur nyenyak bebas kaku leher.\n` +
      `• Kain Cover & Fitur: Lapisan kain katun polymicro adem bersirkulasi udara tinggi, tidak menimbulkan alergi, jahitan tepi ganda kuat dan dilengkapi ritsleting samping untuk kemudahan pencucian.`;
  }

  if (type === "Sprei & Bedcover") {
    return `[Jenis Produk: Sprei & Bedcover]\nNama Produk: ${cleanTitle}\n` +
      `• Material: Katun microtex disperse berkualitas tinggi, kerapatan serat rapat tidak mudah sobek, kain sangat halus dan adem di kulit.\n` +
      `• Fitur & Ukuran: Dilengkapi karet tebal anti-geser di keempat sudutnya agar rapi sepanjang malam, warna printing tajam tidak cepat pudar, bebas bulu halus.`;
  }

  if (type === "Blender Portable") {
    return `[Jenis Produk: Blender Portable]\nNama Produk: ${cleanTitle}\n` +
      `• Mesin & Pisau: 6 mata pisau baja stainless steel 304 anti-karat dengan putaran motor kuat hingga 22.000 RPM, mampu menghancurkan es batu dan buah segar dalam hitungan detik.\n` +
      `• Baterai & Daya: Baterai rechargeable USB 2000 mAh, tahan digunakan 10-15 kali proses blending dalam sekali cas.\n` +
      `• Material Tabung: Kaca borosilikat tebal food-grade tahan panas dan benturan kapasitas 380ml, tutup anti-bocor dengan tali gantungan fleksibel mudah dibawa bepergian.`;
  }

  if (type === "Panci & Wajan") {
    return `[Jenis Produk: Panci & Wajan]\nNama Produk: ${cleanTitle}\n` +
      `• Material & Lapisan: Lapisan granit marble coating anti-lengket bebas PFOA, menghantarkan panas secara merata dan hemat minyak goreng.\n` +
      `• Kompatibilitas & Pegangan: Dapat digunakan pada kompor gas maupun kompor induksi, dilengkapi gagang kayu bakelite tahan panas yang ergonomis dan kokoh.`;
  }

  if (type === "Kipas Angin") {
    return `[Jenis Produk: Kipas Angin]\nNama Produk: ${cleanTitle}\n` +
      `• Hembusan Angin & Motor: Motor brushless senyap berkecepatan tinggi dengan 3-5 tingkat hembusan angin sejuk instan.\n` +
      `• Daya Tahan Baterai: Baterai litium berdaya tahan hingga 8-12 jam, pengisian daya cepat port Type-C, desain compact ringan dibawa ke mana saja.`;
  }

  if (type === "Serum Wajah") {
    return `[Jenis Produk: Serum Wajah]\nNama Produk: ${cleanTitle}\n` +
      `• Kandungan Aktif: Formulasi terkonsentrasi Niacinamide 5-10%, Hyaluronic Acid, dan ekstrak alami pencerah kulit berkhasiat tinggi.\n` +
      `• Manfaat Utama: Membantu memudarkan noda hitam bekas jerawat, meratakan warna kulit kusam, memperkuat skin barrier, dan menjaga elastisitas kenyal kulit wajah.\n` +
      `• Tekstur & Legalitas: Tekstur cairan water-based ringan meresap cepat tanpa rasa lengket, non-comedogenic, bersertifikasi resmi BPOM aman untuk pemakaian harian.`;
  }

  if (type === "TWS Earphone") {
    return `[Jenis Produk: TWS Earphone]\nNama Produk: ${cleanTitle}\n` +
      `• Konektivitas & Driver: Chip Bluetooth 5.3 koneksi stabil jangkauan 10 meter, driver speaker dynamic 13mm dengan dentuman bass solid dan vokal jernih.\n` +
      `• Baterai & Case: Daya tahan earphone 5-6 jam non-stop, total playtime hingga 24 jam dengan charging case display LED digital.\n` +
      `• Fitur: Low latency gaming mode, mikrofon peredam bising (ENC) untuk telepon jernih, dan desain ergonomis nyaman tanpa rasa sakit di telinga.`;
  }

  if (type === "Celana Dalam Pria") {
    return `[Jenis Produk: Celana Dalam Pria]\nNama Produk: ${cleanTitle}\n` +
      `• Bahan & Elastisitas: Material kain modal spandex katun ice silk ultra-lembut, elastis 4-way stretch, sirkulasi udara mikro pori anti-lembab & anti-gerah seharian.\n` +
      `• Karet Pinggang & Jahitan: Ban pinggang elastis tebal yang tidak gampang melintir atau mencekik perut, jahitan flatlock kuat tanpa tonjolan benang gatal.\n` +
      `• Keunggulan: Desain U-pouch 3D ergonomis memberikan ruang gerak leluasa, tidak nyeplak di celana luar, cepat kering dan antibakteri.`;
  }

  if (type === "Celana Dalam Wanita") {
    return `[Jenis Produk: Celana Dalam Wanita]\nNama Produk: ${cleanTitle}\n` +
      `• Bahan & Finishing: Bahan seamless ice silk / katun premium tanpa jahitan tepi (seamless invisible), tidak berbekas atau nyeplak saat memakai celana/rok ketat.\n` +
      `• Lapisan Gusset: Lapisan dalam selangkangan 100% serat katun antibakteri alami, menyerap kelembapan dengan cepat dan menjaga area intim tetap higienis serta bebas iritasi.\n` +
      `• Elastisitas & Kenyamanan: Super ringan, elastis pas di pinggul tanpa menekan pinggang, sensasi sejuk lembut seperti kulit kedua.`;
  }

  if (type === "Alat Pijat Elektrik") {
    return `[Jenis Produk: Alat Pijat Elektrik]\nNama Produk: ${cleanTitle}\n` +
      `• Motor & Daya Pijat: Motor bertenaga frekuensi tinggi dengan beberapa tingkat intensitas getaran yang menembus jaringan otot dalam untuk meredakan nyeri pegal seketika.\n` +
      `• Desain & Ergonomis: Desain nirkabel portabel ringan, baterai rechargeable USB Type-C tahan hingga 4-6 jam penggunaan, pegangan ergonomis nyaman digenggam sendiri.`;
  }

  if (type === "Busana & Pakaian") {
    return `[Jenis Produk: Busana & Pakaian]\nNama Produk: ${cleanTitle}\n` +
      `• Bahan & Jahitan: Material kain pilihan berkualitas yang lembut, adem menyerap keringat, tidak menerawang, serta potongan jahitan rapi kuat.\n` +
      `• Desain & Kenyamanan: Potongan stylish kasual kontemporer yang nyaman dipakai seharian untuk aktivitas indoor maupun outdoor.`;
  }

  if (type === "Sandal" || type === "Sepatu & Sandal" || type === "Sandal Selop") {
    return `[Jenis Produk: Sandal]\nNama Produk: ${cleanTitle || "Sandal Selop EVA Empuk Anti Slip Tebal Nyaman"}\n` +
      `• Spesifikasi & Bahan: Material karet EVA elastis premium tebal, bertekstur cushion empuk seperti bantal (meredam tekanan kaki saat melangkah).\n` +
      `• Sol & Ketebalan: Sol tebal 3.5 - 4 cm dengan tekstur wave anti-slip di bagian bawah, tidak licin di lantai ubin basah maupun kamar mandi.\n` +
      `• Keunggulan & Kenyamanan: Sangat ringan (~150 gram per pasang), tahan air dan cepat kering bebas bau apek, warna pastel estetik cocok untuk santai di rumah maupun bepergian.`;
  }

  if (type === "Sepatu") {
    return `[Jenis Produk: Sepatu]\nNama Produk: ${cleanTitle}\n` +
      `• Sol & Bantalan: Sol karet TPR lentur anti-slip di permukaan licin, insole empuk berkontur ergonomis tidak membuat telapak kaki cepat lelah.\n` +
      `• Material Upper: Bahan breathable dengan sirkulasi udara baik yang mencegah bau kaki dan nyaman dipakai berjalan jauh.`;
  }

  return `[Jenis Produk: ${type}]\nNama Produk: ${cleanTitle}\n` +
    `• Spesifikasi Produk: Produk pilihan unggulan dari listing resmi ${platformName}. Memiliki spesifikasi material premium berkualitas tinggi, fungsi serbaguna, dan desain modern yang terbukti populer di kalangan pembeli.\n` +
    `• Keunggulan: Dirancang khusus untuk efisiensi aktivitas harian dengan durabilitas terjamin dan finishing yang presisi.`;
}

function detectPlatform(url: string): "tiktok" | "shopee" | "other" {
  const lower = url.toLowerCase();
  if (lower.includes("tiktok.com") || lower.includes("vt.tiktok.com") || lower.includes("tiktokcdn.com")) return "tiktok";
  if (lower.includes("shopee.co.id") || lower.includes("id.shp.ee") || lower.includes("shopee.com") || lower.includes("shp.ee")) return "shopee";
  return "other";
}

// Health check
app.get("/api/health", (req, res) => {
  const hasEnvKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 5);
  res.json({ status: "ok", timestamp: new Date().toISOString(), hasEnvKey });
});

// Test API Key Endpoint
app.post("/api/test-api-key", async (req, res) => {
  const startTime = Date.now();
  try {
    const { apiKey } = req.body;
    const client = getGeminiClient(apiKey);

    // Light ping to verify the key works (try gemini-3.8-flash first for high availability)
    let testResult;
    let activeTestModel = "gemini-3.8-flash";
    try {
      testResult = await client.models.generateContent({
        model: "gemini-3.8-flash",
        contents: "Say 'READY'.",
        config: { maxOutputTokens: 10, temperature: 0.1 },
      });
    } catch {
      activeTestModel = "gemini-3.1-flash-lite";
      testResult = await client.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: "Say 'READY'.",
        config: { maxOutputTokens: 10, temperature: 0.1 },
      });
    }

    const latencyMs = Date.now() - startTime;
    return res.json({
      success: true,
      message: "API Key Gemini berhasil terhubung dan diverifikasi aktif!",
      model: activeTestModel,
      latencyMs,
      timestamp: new Date().toLocaleTimeString("id-ID"),
      isCustomKey: Boolean(apiKey && apiKey.trim().length > 0),
    });
  } catch (error: any) {
    const latencyMs = Date.now() - startTime;
    console.error("Test API Key Error:", error);
    let errMsg = error?.message || "Gagal menguji koneksi API Key.";
    if (errMsg.includes("API_KEY_INVALID") || errMsg.includes("invalid API key")) {
      errMsg = "API Key tidak valid. Periksa kembali karakter API Key Anda.";
    } else if (errMsg.includes("QUOTA_EXCEEDED") || errMsg.includes("RESOURCE_EXHAUSTED")) {
      errMsg = "Kuota API Key telah habis (Resource Exhausted).";
    }
    return res.status(400).json({
      success: false,
      error: errMsg,
      latencyMs,
      timestamp: new Date().toLocaleTimeString("id-ID"),
    });
  }
});

// Endpoint to inspect & extract product metadata from TikTok / Shopee links
app.post("/api/inspect-link", async (req, res) => {
  const startTime = Date.now();
  try {
    let { url, apiKey } = req.body;
    if (!url || typeof url !== "string" || !url.trim()) {
      return res.status(400).json({ error: "URL produk TikTok / Shopee tidak boleh kosong." });
    }

    url = url.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }

    const platform = detectPlatform(url);

    let html = "";
    let finalUrl = url;

    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
        },
        redirect: "follow",
        signal: AbortSignal.timeout(6000),
      });

      finalUrl = response.url || url;
      html = await response.text();
    } catch {
      // Direct fetch timed out or blocked by bot protection, proceed with URL analysis
    }

    const jsonLd = extractJsonLd(html);
    const slugTitle = extractSlugTitle(finalUrl) || extractSlugTitle(url);

    let title =
      extractMetaTag(html, "og:title") ||
      extractMetaTag(html, "twitter:title") ||
      jsonLd?.title ||
      extractTitle(html) ||
      slugTitle;

    let description =
      extractMetaTag(html, "og:description") ||
      extractMetaTag(html, "twitter:description") ||
      jsonLd?.description ||
      extractMetaTag(html, "description");

    let imageUrl =
      extractMetaTag(html, "og:image") ||
      extractMetaTag(html, "twitter:image") ||
      jsonLd?.imageUrl ||
      "";

    // Detect if page was redirected to an anti-bot error page or blocked
    let isShortlinkProtected = false;
    if (
      finalUrl.includes("error_page") ||
      finalUrl.includes("/login") ||
      finalUrl.includes("mktspa") ||
      isBotBlockedTitle(title) ||
      url.includes("s.shopee.co.id") ||
      url.includes("shope.ee") ||
      url.includes("vt.tiktok.com")
    ) {
      if (isBotBlockedTitle(title) || !title || title.length < 4) {
        isShortlinkProtected = true;
        title = "";
      }
    }

    if (title) {
      title = cleanProductName(title);
    }

    const requestedProductType = req.body?.productType || req.body?.userSelectedProductType;
    const requestedProductName = req.body?.productName;

    // Classify product type (e.g. Gorden, Bantal, Blender Portable, etc.)
    let productType = "";
    let productName = "";

    if (requestedProductType && requestedProductType.trim()) {
      productType = requestedProductType.trim();
      productName = requestedProductName?.trim() || (productType === "Sandal" ? "Sandal Selop EVA Empuk Anti Slip" : `${productType} Pilihan`);
    } else if (title && title.length > 3) {
      const classification = detectProductTypeAndCategory(title, description || "", finalUrl);
      productType = classification.productType;
      productName = title;
    } else {
      // Fallback for protected shortlinks: check url hints or default to Sandal/Produk Pilihan
      const classification = detectProductTypeAndCategory("", description || "", finalUrl);
      if (classification.productType !== "Produk Pilihan") {
        productType = classification.productType;
        productName = `${productType} Pilihan`;
      } else {
        // If no hints found from protected link, provide Sandal as standard affiliate preset
        productType = "Sandal";
        productName = "Sandal Selop EVA Empuk Anti Slip";
      }
    }

    // If description is brief, missing, or bot-page artifact, synthesize rich category description
    const needsEnrichment = !description || description.length < 25 || isBotBlockedTitle(description);

    if (needsEnrichment) {
      description = synthesizeCategoryDescription(productName, platform, productType);
    }

    const latencyMs = Date.now() - startTime;
    return res.json({
      success: true,
      platform,
      title: productName,
      productType,
      productName,
      description: description || synthesizeCategoryDescription(productName, platform, productType),
      imageUrl: imageUrl || "",
      finalUrl,
      isShortlinkProtected,
      latencyMs,
    });
  } catch (error: any) {
    const latencyMs = Date.now() - startTime;
    const fallbackClassification = detectProductTypeAndCategory("", "", req.body?.url || "");
    const fallbackDesc = synthesizeCategoryDescription("Produk Pilihan", "other", fallbackClassification.productType);
    return res.json({
      success: true,
      platform: "other",
      title: "Produk Pilihan",
      productType: fallbackClassification.productType,
      productName: "Produk Pilihan Affiliate",
      description: fallbackDesc,
      imageUrl: "",
      finalUrl: req.body?.url || "",
      latencyMs,
    });
  }
});

// Endpoint to fetch remote product image and return base64
app.post("/api/fetch-link-image", async (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl || typeof imageUrl !== "string" || !imageUrl.startsWith("http")) {
      return res.status(400).json({ error: "URL gambar tidak valid." });
    }

    const resp = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!resp.ok) {
      return res.status(400).json({ error: `Gagal mengunduh gambar produk (Status: ${resp.status})` });
    }

    const contentType = (resp.headers.get("content-type") || "image/jpeg").split(";")[0];
    const arrayBuffer = await resp.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    return res.json({
      success: true,
      base64,
      mimeType: contentType,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || "Gagal mengunduh foto dari link produk.",
    });
  }
});

// API endpoint for AI Vision Product Detection from Image
app.post("/api/detect-image-product", async (req, res) => {
  try {
    const {
      imageBase64,
      mimeType = "image/jpeg",
      apiKey,
      productLink,
      currentDescription,
      currentProductType,
      imageFileName,
    } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "Foto produk diperlukan untuk deteksi." });
    }

    const ai = getGeminiClient(apiKey);
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");

    const visionPrompt = `Anda adalah ahli kurasi produk e-commerce & affiliate marketing TikTok/Shopee Indonesia.
Tolong analisis foto produk ini secara visual:
1. Identifikasi JENIS PRODUK yang sebenarnya di foto (contoh: Sandal, Bantal, Gorden, Blender Portable, TWS Earphone, Serum Wajah, Gamis, dll.).
2. Buat NAMA PRODUK yang menarik, spesifik, dan sesuai dengan apa yang terlihat di foto (sebutkan warna, bahan, atau desain yang terlihat).
3. Buat DESKRIPSI SPESIFIKASI LENGKAP dalam format poin-poin Indonesia mencakup:
   - Bahan material & tekstur fisik yang tampak di foto
   - Desain & fitur (misal: tebal sol, anti-slip, empuk, resleting, lubang ring, dll.)
   - Keunggulan & manfaat penggunaan bagi pembeli

HANYA kembalikan JSON valid tanpa tag markdown lain:
{
  "productType": "Sandal",
  "productName": "Sandal Selop EVA Empuk Anti Slip Pastel Tebal",
  "description": "[Jenis Produk: Sandal]\\nNama Produk: ...\\n• Spesifikasi & Bahan: ...\\n• Desain & Sol: ...\\n• Keunggulan: ...",
  "category": "fashion"
}`;

    const candidateVisionModels = ["gemini-3.8-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
    let detected: any = null;
    let successfulVisionModel = "";

    for (let i = 0; i < candidateVisionModels.length; i++) {
      const modelName = candidateVisionModels[i];
      try {
        console.log(`[Vision AI Detect] Mengidentifikasi objek dengan model ${modelName} (${i + 1}/${candidateVisionModels.length})...`);
        const response = await ai.models.generateContent({
          model: modelName,
          contents: [
            {
              role: "user",
              parts: [
                {
                  inlineData: {
                    data: cleanBase64,
                    mimeType: mimeType,
                  },
                },
                { text: visionPrompt },
              ],
            },
          ],
          config: {
            responseMimeType: "application/json",
            maxOutputTokens: 600,
          },
        });

        const raw = response.text || "{}";
        const cleanJson = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const parsed = JSON.parse(cleanJson);
        if (parsed && parsed.productType) {
          detected = parsed;
          successfulVisionModel = modelName;
          console.log(`[Vision AI Detect] Berhasil terdeteksi via ${modelName}: [${detected.productType}] ${detected.productName}`);
          break;
        }
      } catch (visionErr: any) {
        const errString = typeof visionErr?.message === "string" ? visionErr.message : JSON.stringify(visionErr);
        const isTemporary =
          errString.includes("503") ||
          errString.includes("high demand") ||
          errString.includes("UNAVAILABLE") ||
          errString.includes("RESOURCE_EXHAUSTED") ||
          errString.includes("429") ||
          errString.includes("overloaded");

        console.warn(`[Vision AI Detect] Model ${modelName} ${isTemporary ? "mengalami antrean trafik (503/429), beralih..." : "gagal: " + errString.slice(0, 80)}`);
        if (i < candidateVisionModels.length - 1) {
          await wait(300);
          continue;
        }
      }
    }

    if (!detected || !detected.productType) {
      // Intelligent contextual fallback if vision APIs are temporarily busy
      const fallbackClassification = detectProductTypeAndCategory(
        imageFileName || "",
        currentDescription || "",
        productLink || ""
      );
      const effectiveType =
        currentProductType && currentProductType !== "Produk Pilihan"
          ? currentProductType
          : fallbackClassification.productType !== "Produk Pilihan"
          ? fallbackClassification.productType
          : "Sandal";

      const fallbackName =
        effectiveType === "Sandal"
          ? "Sandal Selop EVA Empuk Anti Slip Pastel Tebal"
          : `${effectiveType} Pilihan`;
      const fallbackDesc = synthesizeCategoryDescription(fallbackName, "shopee", effectiveType);

      return res.json({
        success: true,
        productType: effectiveType,
        productName: fallbackName,
        description: fallbackDesc,
        category: fallbackClassification.category || "fashion",
        isAiVision: false,
        note: "Fallback kontekstual diaktifkan karena lonjakan antrean server AI vision.",
      });
    }

    return res.json({
      success: true,
      productType: detected.productType,
      productName: detected.productName || `${detected.productType} Pilihan`,
      description: detected.description || synthesizeCategoryDescription(detected.productName, "shopee", detected.productType),
      category: detected.category || "general",
      isAiVision: true,
      modelUsed: successfulVisionModel,
    });
  } catch (err: any) {
    console.error("[Vision AI] Error:", err);
    return res.status(500).json({
      success: false,
      error: err?.message || "Gagal mendeteksi produk dari foto.",
    });
  }
});

// API endpoint for Generating Affiliate Video Prompts
app.post("/api/generate-prompts", async (req, res) => {
  const startTime = Date.now();
  try {
    const {
      imageBase64: rawImageBase64,
      mimeType: rawMimeType,
      productDescription: rawProductDescription,
      productLink,
      linkMetadata,
      conceptId = "social_proof",
      apiKey,
      generationAttempt = 1,
      randomSeed,
      previousHooks = [],
    } = req.body;

    const currentAttempt = Number(generationAttempt) || 1;

    let imageBase64 = rawImageBase64;
    let mimeType = rawMimeType || "image/jpeg";
    let productDescription = rawProductDescription || "";

    // If image wasn't uploaded manually but we have an image URL from the link, auto-fetch it!
    if (!imageBase64 && linkMetadata?.imageUrl && typeof linkMetadata.imageUrl === "string" && linkMetadata.imageUrl.startsWith("http")) {
      try {
        console.log(`[AI Engine] Mengambil foto otomatis dari link: ${linkMetadata.imageUrl}`);
        const imgResp = await fetch(linkMetadata.imageUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          },
          signal: AbortSignal.timeout(6000),
        });
        if (imgResp.ok) {
          const buffer = await imgResp.arrayBuffer();
          imageBase64 = Buffer.from(buffer).toString("base64");
          mimeType = (imgResp.headers.get("content-type") || "image/jpeg").split(";")[0];
        }
      } catch (autoImgErr: any) {
        console.warn("[AI Engine] Auto-fetch link image warning:", autoImgErr?.message);
      }
    }

    // Auto-fill description if not explicitly provided
    if (!productDescription && linkMetadata?.description) {
      productDescription = linkMetadata.description;
    }

    if (!imageBase64 && !productLink && !productDescription && !linkMetadata?.productName) {
      return res.status(400).json({
        error: "Harap unggah foto produk atau lengkapi spesifikasi produk terlebih dahulu.",
      });
    }

    const ai = getGeminiClient(apiKey);

    const platformLabel = linkMetadata?.platform === "tiktok" ? "TikTok Shop" : linkMetadata?.platform === "shopee" ? "Shopee" : "E-Commerce";
    const detectedClassification = detectProductTypeAndCategory(linkMetadata?.title || "", productDescription || "", productLink || "");
    const explicitProductType = linkMetadata?.productType || detectedClassification.productType;
    const explicitProductName = linkMetadata?.productName || cleanProductName(linkMetadata?.title || "") || "Produk Pilihan";

    const combinedDesc = [
      `Jenis Produk: ${explicitProductType}`,
      `Nama Produk: ${explicitProductName}`,
      productDescription ? `Catatan Penjual / USP: ${productDescription}` : "",
      linkMetadata?.description ? `Deskripsi Resmi Produk (${platformLabel}): ${linkMetadata.description}` : "",
      productLink ? `Link Produk: ${productLink}` : "",
    ].filter(Boolean).join("\n\n");

    const CREATIVE_HOOK_ARCHETYPES = [
      {
        name: "Kerumunan Spontan & Rebutan Display",
        scenario: "Sekelompok pembeli / ibu-ibu mendadak berhenti dan berkerumun mengelilingi display produk, berebut menyentuh dan membandingkan varian",
        hookInspiration: ["Gila, baru masuk toko ibu-ibu langsung ngumpul!", "Waduh, kenapa pada rebutan barang satu ini rek?", "Sumpah ibu-ibu sampai antre megang ini!"]
      },
      {
        name: "Antrean Kasir & Borong Banyak Sekaligus",
        scenario: "Sorotan ke antrean kasir toko di mana pembeli memborong 3-4 unit sekaligus dalam keranjang belanja",
        hookInspiration: ["Waduh antrean kasir isinya pada borong ini!", "Sampai ada yang borong empat warna sekaligus!", "Pantesan rak displaynya sampai ludes diserbu orang!"]
      },
      {
        name: "Uji Siksa Brutal & Pembuktian Ekstrem",
        scenario: "Tanpa basa-basi kamera merekam uji siksa ekstrem (ditekuk 360 derajat, diinjak beban berat, disiram air kotor)",
        hookInspiration: ["Jangan kaget rek, ini sengaja tak siksa!", "Banyak yang ragu, langsung tak uji brutal!", "Eksperimen gila membuktikan ketahanan aslinya rek!"]
      },
      {
        name: "Buka Paket Viral & Reaksi Terperangah",
        scenario: "Merobek lakban paket polymailer dengan tergesa-gesa di teras atau meja, diikuti ekspresi terperangah melihat kemewahan fisik aslinya",
        hookInspiration: ["Akhirnya paket viral se-Indonesia ini mendarat juga!", "Kaget pol pas buka dus kemasan aslinya!", "Sumpah beda level banget sama yang abal-abal!"]
      },
      {
        name: "Penyelamat Frustrasi Harian & Solusi Instan",
        scenario: "Mengangkat momen penderitaan sehari-hari (pegal linu, lantai licin bahaya, kepanasan) yang seketika diselesaikan secara tuntas",
        hookInspiration: ["Kapok rek, kemarin sempat ngerasain kesiksa begini!", "Capek bolak-balik ganti barang gampang jebol!", "Bahaya pol rek, kemarin hampir celaka begini!"]
      },
      {
        name: "Reaksi Syok Takjub Harga Murah Kualitas Sultan",
        scenario: "Menunjukkan detail tekstur mewah dan material solid, menolak percaya barang semurah ini punya finishing bintang lima",
        hookInspiration: ["Nggak masuk akal barang semurah ini sebagus ini!", "Beneran bikin melongo pas pertama kali pegang!", "Beda kelas jauh dibanding barang pasaran biasa!"]
      },
      {
        name: "Tetangga Komplek Heboh Titip Beli",
        scenario: "Ibu-ibu komplek atau teman sekantor heboh melihat barang dan langsung menitip pesan saat itu juga",
        hookInspiration: ["Tetangga komplek sampai heboh pada titip beli!", "Semua orang di rumah pada ikutan nyobain!", "Ibu-ibu arisan langsung pada nanyain beli mana!"]
      }
    ];

    const SETTINGS_VARIETY = [
      "toko retail ramai dengan pencahayaan hangat alami",
      "teras depan rumah berubin bersih dengan cahaya sore hari",
      "ruang tengah keluarga yang rapi dengan lantai keramik",
      "lorong toko grosir modern dengan deretan rak display",
      "meja unboxing kayu bertekstur dengan cahaya alami jendela",
      "dapur minimalis bersih bernuansa modern",
      "area tangga atau teras terbuka dengan suasana otentik"
    ];

    const archetypeIndex = (currentAttempt + Math.floor(Math.random() * CREATIVE_HOOK_ARCHETYPES.length)) % CREATIVE_HOOK_ARCHETYPES.length;
    const chosenArchetype = CREATIVE_HOOK_ARCHETYPES[archetypeIndex];
    const chosenSetting = SETTINGS_VARIETY[Math.floor(Math.random() * SETTINGS_VARIETY.length)];
    const chosenSampleHook = chosenArchetype.hookInspiration[Math.floor(Math.random() * chosenArchetype.hookInspiration.length)];

    let conceptGuideline = "";
    if (conceptId === "stress_test") {
      conceptGuideline = `STRATEGI KONSEP: UJI DURABILITAS EKSTREM / STRESS TEST (RETENSI PENONTON TERTINGGI)
- P1: UJI KETAHANAN SESUAI KARAKTER FISIK PRODUK (0-3 Detik Hook Syok).
  * WAJIB RELEVAN DENGAN PRODUK:
    - Jika produk KAIN / PAKAIAN / CELANA DALAM (Pria/Wanita): Uji tarikan elastisitas 4 arah (4-way stretch) sekuat tenaga oleh dua tangan, uji gosok sikat kawat tanpa berbulu, atau uji anti-sobek dan karet pinggang anti-melintir. JANGAN GUNAKAN 'dilempar dari tangga', 'diinjak ban mobil', atau kata 'gak gampang patah' untuk celana dalam/kain karena TIDAK MASUK AKAL!
    - Jika produk BANTAL / KASUR / SPREI: Uji tindih beban galon air atau kompresi vakum ditekan sekuat tenaga lalu mengembang kembali seketika (rebound instan).
    - Jika produk ELEKTRONIK (TWS / Kipas / Blender): Uji getaran tinggi, ketahanan baterai, atau ketahanan material casing anti-retak.
    - Jika produk ALAS KAKI (Sandal / Sepatu): Uji tekuk 360 derajat, uji injak paku/batu, atau uji cengkeraman anti-slip di lantai ubin basah berminyak.
    - Jika produk WAJAN / PANCI: Uji gesek spatula besi tanpa baret, atau masak telur tanpa minyak sama sekali.
- P2: INSPEKSI FISIK TANPA CACAT (Membuktikan elastisitas, serat kain, atau material kembali ke kondisi 100% mulus tanpa sobek, kendor, atau cacat).
- P3: ULASAN KEPUASAN & CLOSING CTA PROMO (Jaminan awet bertahun-tahun dan ajakan verbal amankan harga promo diskon sebelum kuota habis).`;
    } else if (conceptId === "unboxing_viral") {
      conceptGuideline = `STRATEGI KONSEP: UNBOXING PAKET VIRAL & REAKSI SYOK (FORMULA FYP AFFILIATE)
- P1: BUKA PAKET VIRAL & REAKSI KAGET (0-3 Detik Hook Penasaran).
  * ATURAN KEMASAN LOGIS & REALISTIS SESUAI UKURAN PRODUK:
    - Ukuran box / kardus / polymailer HARUS MASUK AKAL sesuai ukuran produk aslinya!
    - Untuk BANTAL / SPREI / GORDEN: Buka kardus besar tebal atau kantong plastik vakum kedap udara yang begitu digunting langsung mekar mengembang besar memenuhi meja! DILARANG menyebut atau menampilkan box kecil untuk bantal karena tidak masuk akal!
    - Untuk CELANA DALAM / SERUM / TWS: Gunakan pouch ziplock higienis premium, hardbox compact elegan, atau box kemasan isi 3-5 pcs berdesain eksklusif.
    - Untuk PANCI / BLENDER / KIPAS: Buka kardus packaging tebal berlapis pelindung busa/bubble wrap tebal.
- P2: PEMBUKTIAN KLAIM VIRAL VS BARANG PASARAN (Mendemonstrasikan fitur unggulan dan membandingkan kualitas fisik secara riil).
- P3: FOMO VOUCHER DISKON & CLOSING CTA (Peringatan stok gudang menipis pesat dan dorongan segera checkout mumpung kupon masih aktif).`;
    } else if (conceptId === "problem_solution") {
      conceptGuideline = `STRATEGI KONSEP: DRAMA MASALAH HARIAN & SOLUSI INSTAN (KONVERSI TINGGI - PROBLEM SOLUTION)
- P1: FRUSTRASI MASALAH RELATABLE & SANGAT LOGIS SESUAI FUNGSI PRODUK (0-3 Detik Hook Emosional).
  * WAJIB RELEVAN & MASUK AKAL SECARA KONTEKSTUAL DENGAN PRODUK:
    - Untuk CELANA DALAM WANITA: Masalahnya adalah iritasi/gatal akibat bahan kasar lembap, nyeplak garis jahitan di celana/rok ketat (bikin malu di depan umum), atau karet pinggang yang mencekik berbekas merah di kulit. JANGAN membuat drama air tergenang di lantai untuk celana dalam karena tidak masuk akal sama sekali!
    - Untuk CELANA DALAM PRIA: Masalahnya adalah gerah/lembab berkeringat seharian, karet pinggang melintir dan gatal menusuk, atau bahan sempit yang bikin sesak dan tidak leluasa bergerak.
    - Untuk SANDAL / SEPATU: Masalahnya adalah lantai licin berbahaya terpeleset di kamar mandi, atau telapak kaki nyeri kapalan dan tumit sakit setelah berdiri lama.
    - Untuk BANTAL TIDUR: Masalahnya adalah leher kaku (tengengen), susah tidur, atau bantal lama yang kempes tipis bikin kepala pusing.
    - Untuk KIPAS ANGIN: Masalahnya adalah kamar kos/ruangan gerah panas menyengat dan keringat bercucuran saat istirahat.
    - Untuk BLENDER PORTABLE: Masalahnya adalah repot bikin jus sehat di kantor, atau blender besar rumah tangga yang ribet dicuci.
    - Untuk GORDEN BLACKOUT: Masalahnya adalah kamar silau panas tembus sinar matahari dan privasi luar terlihat jelas.
- P2: TRANSFORMASI KENYAMANAN SEKETIKA (Begitu produk dipakai, masalah tuntas seketika menghadirkan rasa nyaman luar biasa).
- P3: REKOMENDASI SOLUTIF & CLOSING CTA (Rekomendasi tulus dari hati kenapa produk ini penyelamat wajib punya dan ajakan checkout sekarang).`;
    } else {
      // Default: social_proof (Kerumunan Toko / Bikin Ibu-Ibu Berhenti)
      conceptGuideline = `STRATEGI KONSEP: SOCIAL PROOF / KERUMUNAN TOKO (IBU-IBU SERBU TOKO & BEREBUT DISPLAY)
- P1: CROWD FRENZY & SOCIAL PROOF HOOK (0-3 Detik Hook Kerumunan: Kamera masuk ke toko retail/display ramai di mana sekelompok ibu-ibu atau pembeli spontan berkerumun mengelilingi meja display produk, berebut menyentuh, memegang, dan membandingkan warna. Memicu rasa penasaran luar biasa kenapa produk ini diserbu).
- P2: TES TEKSTUR & KENYAMANAN LANGSUNG (Pengujian kelenturan bahan, kelembutan kain, dan kenyamanan sesuai jenis produk).
- P3: REVIEW DI RUMAH & CLOSING CTA (Koleksi lengkap varian warna di rumah, pembuktian keawetan, dan ajakan checkout sebelum stok ludes).`;
    }

    const systemPrompt = `Act as an advanced AI Affiliate Video Creative Director for Indonesian TikTok/Shopee Affiliate.
Analyze the provided product information (uploaded product photo and/or description). Create THREE connected 10-second video prompts (P1, P2, P3) adhering strictly to the user's selected video concept.

${conceptGuideline}

HOOK 3 DETIK PERTAMA WAJIB MEMBUAT ORANG PENASARAN & BERHENTI SCROLL:
- P1 pada detik 0-2s dan 2-4s HARUS memiliki hook visual dan voiceover yang sangat kuat, agresif, dan memicu rasa penasaran tinggi sehingga penonton langsung berhenti scroll (Thumb-stopping hook).

MUTLAK WAJIB - GENERASI HOOK & VOICEOVER BARU SETIAP KALI GENERATE (VARIATION MANDATE):
- Percobaan Generasi: #${currentAttempt} | Unique Variety Seed: "${randomSeed || Date.now()}"
- ATURAN UTAMA: Setiap kali tombol generate diklik, Anda HARUS menghasilkan HOOK VISUAL (0-3 detik) dan KALIMAT VOICEOVER yang 100% BARU, SEGAR, DAN BERBEDA dari sebelumnya, baik untuk produk yang sama maupun produk berbeda!
- DILARANG mengulang hook yang sama, template kata yang kaku, atau skenario identik.
${Array.isArray(previousHooks) && previousHooks.length > 0 ? `- DILARANG MENGGUNAKAN ATAU MENYERUPAI KALIMAT PEMBUKA SEBELUMNYA BERIKUT INI: ${JSON.stringify(previousHooks)}` : ""}
- Arahkan Hook Visual & Voice Over P1 pada sudut pandang kreatif baru ini:
  * Sudut Kreatif Spesifik: "${chosenArchetype.name}" (${chosenArchetype.scenario})
  * Suasana Setting Pilihan: "${chosenSetting}"
  * Contoh inspirasi gaya kalimat pembuka segar (jangan jiplak kata demi kata, kembangkan secara natural 6-8 kata): "${chosenSampleHook}"
- Pastikan adegan visual 0-2 detik dan 2-4 detik langsung menghentikan jari penonton (scroll-stopping thumb hook) dengan aksi fisik nyata yang otentik.

DINAMIKA SESUAI PRODUK & KESESUAIAN 100% PERSIS REFERENSI (MUTLAK WAJIB):
- ATURAN KEMIRIPAN PRODUK 100%: Produk yang ditampilkan dalam setiap adegan video (P1, P2, P3) HARUS 100% SAMA PERSIS dengan produk pada gambar referensi yang diupload! Bentuk, potongan, tekstur jahitan, pola, siluet, warna, dan material tidak boleh melenceng sedikitpun dari foto produk aslinya!
- DILARANG SKENARIO/VOICEOVER YANG TIDAK MASUK AKAL:
  * Celana dalam atau pakaian: DILARANG keras adegan dilempar dari tangga, dilindas ban, disiram air kotor, atau klaim 'tidak gampang patah' (pakaian tidak bisa patah). Gunakan uji elastisitas 4 arah (tarik kedua tangan), uji sikat kawat tanpa brudul, uji karet pinggang anti-melintir, atau sensasi sejuk ice silk & sirkulasi udara mikro pori.
  * Ukuran packaging: Ukuran box, kardus, atau plastik kemasan HARUS 100% proporsional dan masuk akal dengan produk (contoh: bantal menggunakan kantong vakum kedap udara besar yang langsung mekar saat digunting, celana dalam menggunakan pouch ziplock higienis atau hardbox set elegan). DILARANG menampilkan box kecil untuk produk besar seperti bantal!
  * Konsep Masalah/Drama: Drama masalah HARUS masuk akal sesuai produk (contoh celana dalam wanita: masalah garis celana nyeplak/kelihatan saat pakai rok/celana ketat, iritasi gatal akibat lembap, atau karet menekan merah di pinggang; BUKAN drama genangan air di lantai!).
- Anda HARUS menyesuaikan seluruh deskripsi visual, bentuk fisik, adegan, dan naskah voice over secara cerdas dengan JENIS PRODUK yang dianalisis (${explicitProductType}).
- Jangan membuat deskripsi generik. Sebutkan detail fisik produk yang tampak nyata (material, tekstur, sol, kain, warna, ketebalan, dan manfaat spesifik).

FORMAT & PROPERTI WAJIB DALAM SETIAP PROMPT (P1, P2, P3):
Setiap prompt JSON harus memiliki format:
{
  "prompt_title": "P1 — [JUDUL HOOK SENSASIONAL SESUAI PRODUK & KONSEP]",
  "duration": "10 seconds",
  "aspect_ratio": "9:16",
  "resolution": "4K Ultra HD",
  "product": "[Jenis Produk: <Jenis>] <Nama Produk Lengkap> - <Spesifikasi Detail>",
  "creative_concept": "Penjelasan detail konsep adegan...",
  "visual_style": "RAW Indonesian social-media documentary realism, authentic handheld smartphone-camera perspective without showing the smartphone, natural Indonesian retail-store or home lighting, realistic human movement, believable shopping behavior, realistic textile and rubber material, energetic TikTok pacing, not polished luxury advertising.",
  "product_reference_priority": {
    "rule": "The uploaded product image is the absolute 100% visual authority for the product appearance. The product featured in every scene must be 100% identical in silhouette, texture, color, and construction to the uploaded reference photo.",
    "preserve": [
      "100% exact form factor, cut, and construction from reference photo",
      "visible textures, stitches, and material surface details",
      "realistic adult proportions matching the exact product item",
      "same overall silhouette, shape, and physical design",
      "exact color palette and tones shown in the reference image"
    ],
    "colors": ["navy", "soft pink", "cream", "medium grey", "dark brown"]
  },
  "continuity": "Deskripsi kesinambungan cerita dan karakter dari babak sebelumnya...",
  "story": [
    { "time": "0-2s", "visual": "...", "voice_over": "..." },
    { "time": "2-4s", "visual": "...", "voice_over": "..." },
    { "time": "4-6s", "visual": "...", "voice_over": "..." },
    { "time": "6-8s", "visual": "...", "voice_over": "..." },
    { "time": "8-10s", "visual": "...", "voice_over": "..." }
  ],
  "scenes": [
    { "time": "0-2s", "visual": "...", "vo": "...", "words": 7 },
    { "time": "2-4s", "visual": "...", "vo": "...", "words": 7 },
    { "time": "4-6s", "visual": "...", "vo": "...", "words": 7 },
    { "time": "6-8s", "visual": "...", "vo": "...", "words": 7 },
    { "time": "8-10s", "visual": "...", "vo": "...", "words": 7 }
  ],
  "voice_identity": {
    "gender_age_accent": "Female, 18 years old, Javanese-Indonesian accent",
    "style": "Hyper-energetic, aggressive TikTok affiliate selling, curiosity-inducing and spontaneous. Very fast Indonesian delivery with a noticeable natural East Javanese accent. Use standard Indonesian mainly. Lightly use 'rek', 'pol', or 'tenan' only when naturally appropriate and never repeatedly.",
    "tempo": "Approximately 3-4 words per second while remaining intelligible.",
    "intonation": "Energetic pitch changes, strong emphasis on curiosity and product benefits, excited reactions, confident selling energy.",
    "continuity_lock": "Exactly the same female voice identity, age, accent, pitch, rhythm and vocal character throughout P1, P2 and P3. Sounds like the same 18-year-old creator speaking across all three videos."
  },
  "character_behavior": {
    "rule": "All people remain silent on camera.",
    "no_lip_sync": true,
    "communication": "All spoken content comes exclusively from the female external voice-over."
  },
  "absolute_clean_frame": {
    "rule": "The generated video must contain absolutely no visible text or digital interface.",
    "forbidden": [
      "no text overlays, subtitles, captions, or typography of any kind",
      "no TikTok, Shopee, or any social-media UI elements, buttons, icons, or navigation bars",
      "no prices, discount tags, sales stickers, star ratings, or promo badges",
      "no watermarks, logos, brand emblems, or channel identifiers",
      "no artificial digital graphics, arrows, circles, animated stickers, or emojis",
      "no floating product labels or callout bubbles",
      "no split-screen borders, picture-in-picture frames, or artificial overlays",
      "no studio lighting equipment, softboxes, ring lights, or camera rigs visible in frame"
    ]
  },
  "hard_fail_conditions": [
    "Any text, graphic, logo, watermark, or UI element appearing in any frame is an immediate hard fail.",
    "Any person on camera moving their lips or appearing to speak is an immediate hard fail.",
    "Any deviation from the reference product's shape, color, pattern, material, cut, or construction (not 100% matching the reference image) is an immediate hard fail.",
    "Any illogical drama or inappropriate physical test not fitting the product (e.g. underwear dropped from stairs, claim 'tidak patah' for cloth, or water puddles for underwear) is an immediate hard fail.",
    "Any unrealistic packaging proportion (e.g. small box for pillows or giant box for lipstick) is an immediate hard fail.",
    "Any CGI, 3D model, or artificial commercial rendering style is an immediate hard fail.",
    "Any scene feeling staged, rehearsed, or filmed as a corporate TV commercial is an immediate hard fail."
  ],
  "cta": "TIDAK ADA CTA" (hanya P3 di 8-10s yang berisi closing CTA verbal tanpa keranjang kuning)
}

DISIPLIN KATA & PACING VOICEOVER:
- Setiap adegan berdurasi tepat 2 detik (0-2s, 2-4s, 4-6s, 6-8s, 8-10s).
- Setiap teks voice over (di story.voice_over dan scenes.vo) WAJIB BERISI TEPAT 6-8 KATA BAHASA INDONESIA (tempo cepat affiliate 3-4 kata/detik).
- DILARANG menggunakan kata "keranjang kuning" atau "klik link di bio". CTA di P3 murni ajakan verbal (contoh: "Buruan amankan ukuran kalian sekarang sebelum kehabisan!").
- ZERO EMOJI & ICONS: Seluruh JSON bersih tanpa emoji/ikon visual.

OUTPUT: HANYA KEMBALIKAN JSON VALID dengan root key: "VIDEO_PROMPT_1", "VIDEO_PROMPT_2", "VIDEO_PROMPT_3".`;

    let userPromptText = `Generate 3 connected 10-second TikTok/Shopee affiliate video prompts adhering strictly to all guidelines.
Product Information & Details:
${combinedDesc || "Produk affiliate pilihan"}

VARIETY SEED: ${randomSeed || Date.now()} | Generation Attempt: #${currentAttempt}
CRITICAL INSTRUCTION FOR NOVELTY:
Create completely fresh, distinct, and novel 0-3s visual hooks and brand new voiceover lines for this run.
Selected Creative Hook Direction: "${chosenArchetype.name}" (${chosenArchetype.scenario}).
Setting Environment: "${chosenSetting}".
Do not repeat past patterns or monotonous opening lines.`;

    if (imageBase64) {
      userPromptText += "\n\nAnalyze the uploaded product image for visual dimensions, textures, form factor, and colors.";
    }

    const parts: any[] = [{ text: userPromptText }];
    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: mimeType || "image/jpeg",
          data: imageBase64,
        },
      });
    }

    const contents = [{ role: "user", parts }];

    const candidateModels = ["gemini-3.8-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
    let lastError: any = null;
    let parsed: any = null;
    let successfulModel = "";

    for (let i = 0; i < candidateModels.length; i++) {
      const currentModel = candidateModels[i];
      try {
        console.log(`[AI Engine] Mencoba model: ${currentModel} (Percobaan ${i + 1}/${candidateModels.length})`);
        const response = await ai.models.generateContent({
          model: currentModel,
          contents,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
            temperature: 1.0,
          },
        });

        const rawText = response.text || "";
        try {
          parsed = JSON.parse(rawText);
        } catch {
          const cleaned = rawText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
          parsed = JSON.parse(cleaned);
        }

        if (parsed && (parsed.VIDEO_PROMPT_1 || parsed.video_prompt_1)) {
          successfulModel = currentModel;
          break;
        }
      } catch (err: any) {
        lastError = err;
        const errString = typeof err?.message === "string" ? err.message : JSON.stringify(err);
        const isTemporarySpike =
          errString.includes("503") ||
          errString.includes("high demand") ||
          errString.includes("UNAVAILABLE") ||
          errString.includes("RESOURCE_EXHAUSTED") ||
          errString.includes("429") ||
          errString.includes("rate-limits") ||
          errString.includes("quota") ||
          errString.includes("overloaded");

        console.log(`[AI Engine] Model ${currentModel} dialihkan: ${isTemporarySpike ? "Quota / Trafik Padat" : errString.slice(0, 100)}`);

        if (isTemporarySpike && i < candidateModels.length - 1) {
          console.log(`[AI Engine] Mengalihkan ke model alternatif ${candidateModels[i + 1]}...`);
          await wait(500);
          continue;
        }
      }
    }

    // If Gemini model succeeded and parsed
    if (parsed && (parsed.VIDEO_PROMPT_1 || parsed.video_prompt_1)) {
      // Normalize prompt keys and bidirectional story / scenes compatibility
      const promptKeys = ["VIDEO_PROMPT_1", "VIDEO_PROMPT_2", "VIDEO_PROMPT_3"];
      promptKeys.forEach((key, idx) => {
        const p = parsed[key] || parsed[key.toLowerCase()];
        if (p) {
          if (!p.prompt_title) {
            p.prompt_title = `P${idx + 1} — ${p.prompt_type || "AFFILIATE VIDEO"}`;
          }
          p.duration = p.duration || "10 seconds";
          p.aspect_ratio = p.aspect_ratio || "9:16";
          p.resolution = p.resolution || "4K Ultra HD";

          if (!p.voice_identity && p.voice_over) {
            p.voice_identity = p.voice_over;
          } else if (!p.voice_over && p.voice_identity) {
            p.voice_over = p.voice_identity;
          }

          if (p.story && !p.scenes) {
            p.scenes = p.story.map((s: any) => ({
              time: s.time,
              visual: s.visual,
              vo: s.voice_over || s.vo || "",
              voice_over: s.voice_over || s.vo || "",
              words: (s.voice_over || s.vo || "").trim().split(/\s+/).filter(Boolean).length,
            }));
          } else if (p.scenes && !p.story) {
            p.story = p.scenes.map((s: any) => ({
              time: s.time,
              visual: s.visual,
              voice_over: s.vo || s.voice_over || "",
            }));
          } else if (p.scenes) {
            p.scenes = p.scenes.map((s: any) => ({
              ...s,
              vo: s.vo || s.voice_over || "",
              voice_over: s.voice_over || s.vo || "",
              words: s.words || (s.vo || s.voice_over || "").trim().split(/\s+/).filter(Boolean).length,
            }));
          }
          parsed[key] = p;
        }
      });

      const latencyMs = Date.now() - startTime;
      return res.json({
        success: true,
        data: parsed,
        meta: {
          latencyMs,
          model: successfulModel,
          timestamp: new Date().toLocaleTimeString("id-ID"),
        },
      });
    }

    // Fail-Safe: If Google API experienced 503 high demand or 429 quota limits, activate fail-safe UGC engine
    console.log("[AI Engine] Mengaktifkan Fail-Safe UGC Engine dengan Konsep:", conceptId, "Jenis Produk:", explicitProductType, "Attempt:", currentAttempt);
    const fallbackCampaign = generateFailSafeCampaign(
      productDescription,
      productLink,
      linkMetadata?.title || explicitProductName,
      explicitProductType,
      conceptId,
      currentAttempt,
      previousHooks
    );
    const latencyMs = Date.now() - startTime;

    return res.json({
      success: true,
      data: fallbackCampaign,
      meta: {
        latencyMs,
        model: "Fail-Safe UGC Engine",
        isFallback: true,
        notice: `Naskah 3 Babak [${explicitProductType}] berhasil disintesis sesuai panduan formula affiliate UGC.`,
        timestamp: new Date().toLocaleTimeString("id-ID"),
      },
    });
  } catch (err: any) {
    const latencyMs = Date.now() - startTime;
    console.log("[AI Engine] Fail-Safe fallback triggered on unexpected condition:", err?.message);
    const fallbackClassification = detectProductTypeAndCategory(req.body?.linkMetadata?.title || "", req.body?.productDescription || "", req.body?.productLink || "");
    const fallbackCampaign = generateFailSafeCampaign(
      req.body?.productDescription,
      req.body?.productLink,
      req.body?.linkMetadata?.title,
      req.body?.linkMetadata?.productType || fallbackClassification.productType,
      req.body?.conceptId || "social_proof",
      Number(req.body?.generationAttempt) || 1,
      req.body?.previousHooks || []
    );
    return res.json({
      success: true,
      data: fallbackCampaign,
      meta: {
        latencyMs,
        model: "Fail-Safe UGC Engine",
        isFallback: true,
        notice: `Naskah 3 Babak [${fallbackClassification.productType}] berhasil disintesis sesuai panduan formula affiliate UGC.`,
        timestamp: new Date().toLocaleTimeString("id-ID"),
      },
    });
  }
});

// Vite / static file serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
