import React, { useState } from "react";
import { CampaignPrompts, ProductLinkMeta, VideoConceptId } from "../types";
import { DEMO_PRODUCTS } from "../data/defaultData";
import { VIDEO_CONCEPTS } from "../data/videoConcepts";
import { ApiKeyConnector, ApiKeyStatus } from "./ApiKeyConnector";
import { BackendAnalysisConsole } from "./BackendAnalysisConsole";
import { ThreeColumnPrompts } from "./ThreeColumnPrompts";
import { VideoConceptSelector } from "./VideoConceptSelector";
import {
  Sparkles,
  Upload,
  RefreshCw,
  Camera,
  CheckCircle2,
  Trash2,
  Link,
  ExternalLink,
  Search,
  Check,
  ShoppingBag,
  ArrowRight,
  Info,
  Image as ImageIcon,
  Flame,
} from "lucide-react";

interface PromptBuilderTabProps {
  onCampaignGenerated: (campaign: CampaignPrompts) => void;
  showToast: (message: string, type?: "success" | "error") => void;
  currentCampaign: CampaignPrompts;
}

const SAMPLE_PRODUCT_LINKS = [
  {
    name: "Shopee: Sandal Selop EVA Empuk Anti Slip",
    platform: "shopee" as const,
    productType: "Sandal",
    productName: "Sandal Selop EVA Empuk Anti Slip Pastel Tebal Nyaman",
    url: "https://shopee.co.id/Sandal-Selop-EVA-Empuk-Anti-Slip-Pastel-Tebal-Nyaman-i.6789012.345678",
    title: "Sandal Selop EVA Empuk Anti Slip Pastel Tebal Nyaman",
    desc: "[Jenis Produk: Sandal]\nNama Produk: Sandal Selop EVA Empuk Anti Slip Pastel Tebal Nyaman\n• Spesifikasi & Bahan: Material karet EVA elastis premium tebal, bertekstur cushion empuk seperti bantal.\n• Sol & Ketebalan: Sol tebal 3.5 - 4 cm dengan tekstur wave anti-slip, tidak licin di lantai ubin basah maupun kamar mandi.\n• Keunggulan: Sangat ringan, tahan air cepat kering, warna pastel estetik.",
    imageUrl: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Shopee: Gorden Blackout Smokering 12 Ring",
    platform: "shopee" as const,
    productType: "Gorden",
    productName: "Gorden Blackout Smokering 12 Lubang Embos Mewah",
    url: "https://shopee.co.id/Gorden-Blackout-Smokering-12-Lubang-Embos-Mewah-Peredam-Panas-i.5432109.876543",
    title: "Gorden Blackout Smokering 12 Lubang Embos Mewah",
    desc: "[Jenis Produk: Gorden]\nNama Produk: Gorden Blackout Smokering 12 Lubang Embos Mewah\n• Spesifikasi & Bahan: Kain blackout impor tebal grade A premium (meredam sinar matahari dan silau hingga 90%).\n• Ukuran & Ring: Lebar 140 cm x Tinggi 200 cm dengan 12 lubang ring smokering perak (6 gelembung rapi elegan).\n• Keunggulan: Bahan tidak tembus pandang, kain halus jatuh tidak kaku, warna awet tidak luntur dicuci.",
    imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Shopee: Bantal Tidur Hotel Silikon Grade A",
    platform: "shopee" as const,
    productType: "Bantal",
    productName: "Bantal Tidur Hotel Bintang 5 Silikon Super Empuk",
    url: "https://shopee.co.id/Bantal-Tidur-Hotel-Bintang-5-Silikon-Super-Empuk-Anti-Kempes-i.9876543.210987",
    title: "Bantal Tidur Hotel Bintang 5 Silikon Super Empuk",
    desc: "[Jenis Produk: Bantal]\nNama Produk: Bantal Tidur Hotel Bintang 5 Silikon Super Empuk\n• Spesifikasi & Isian: 100% serat silikon mikrofiber grade A empuk anti-kempes, elastisitas tinggi kembali mengembang seketika.\n• Ukuran & Bobot: Ukuran 45 cm x 65 cm (berat ~850 gram), ergonomis menopang leher dan kepala bebas pegal.\n• Kain Cover: Katun polymicro adem bersirkulasi udara tinggi dengan jahitan ganda rapi dan resleting samping.",
    imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Shopee: Blender Portable USB 6 Pisau",
    platform: "shopee" as const,
    productType: "Blender Portable",
    productName: "Blender Portable Mini Juicer USB Rechargeable 6 Pisau Kaca Borosilikat",
    url: "https://shopee.co.id/Blender-Portable-Mini-Juicer-USB-Rechargeable-6-Pisau-Kaca-Borosilikat-i.1234567.890123",
    title: "Blender Portable Mini Juicer USB Rechargeable 6 Pisau Kaca Borosilikat",
    desc: "[Jenis Produk: Blender Portable]\nNama Produk: Blender Portable Mini Juicer USB Rechargeable 6 Pisau Kaca Borosilikat\n• Spesifikasi Mesin & Pisau: 6 mata pisau baja stainless steel 304, motor 22.000 RPM mampu menghancurkan es batu dan buah segar.\n• Baterai & Daya: Baterai isi ulang USB 2000 mAh tahan 10-15 kali blender sekali cas.\n• Material: Kaca borosilikat food-grade tebal kapasitas 380ml anti-pecah mudah dicuci.",
    imageUrl: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "TikTok Shop: TWS Wireless Bluetooth 5.3",
    platform: "tiktok" as const,
    productType: "TWS Earphone",
    productName: "TWS Wireless Earbuds Bluetooth 5.3 Low Latency Bass Booster",
    url: "https://vt.tiktok.com/ZS2xXxYyZ/",
    title: "TWS Wireless Earbuds Bluetooth 5.3 Low Latency Bass Booster",
    desc: "[Jenis Produk: TWS Earphone]\nNama Produk: TWS Wireless Earbuds Bluetooth 5.3 Low Latency Bass Booster\n• Audio & Koneksi: Bluetooth 5.3 koneksi stabil, driver 13mm deep bass solid dan ENC noise reduction telepon jernih.\n• Baterai: Daya tahan earphone 6 jam non-stop, total 24 jam dengan charging case display digital LED.\n• Desain: Semi in-ear ergonomis ringan tidak sakit di telinga dan tahan keringat IPX4.",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Shopee: Serum Wajah Niacinamide 10%",
    platform: "shopee" as const,
    productType: "Serum Wajah",
    productName: "Brightening Face Serum Niacinamide 10% + Zinc 1% Pencerah Noda Hitam",
    url: "https://shopee.co.id/Brightening-Serum-Niacinamide-10-Zinc-Pencerah-Kulit-Kusam-i.7654321.109876",
    title: "Brightening Face Serum Niacinamide 10% + Zinc 1% Pencerah Noda Hitam",
    desc: "[Jenis Produk: Serum Wajah]\nNama Produk: Brightening Face Serum Niacinamide 10% + Zinc 1% Pencerah Noda Hitam\n• Kandungan Aktif: 10% Pure Niacinamide, Hyaluronic Acid, dan 1% Zinc PCA untuk mencerahkan noda bekas jerawat dan mengontrol minyak.\n• Tekstur & Formulasi: Cairan water-based ringan cepat meresap tanpa rasa lengket, bersertifikat resmi BPOM aman dipakai setiap hari.",
    imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Shopee: Celana Dalam Pria Boxer Ice Silk",
    platform: "shopee" as const,
    productType: "Celana Dalam Pria",
    productName: "Celana Dalam Pria Boxer Katun Modal Ice Silk Anti-Bakteri 4-Way Stretch",
    url: "https://shopee.co.id/Celana-Dalam-Pria-Boxer-Katun-Modal-Ice-Silk-i.3344556.778899",
    title: "Celana Dalam Pria Boxer Katun Modal Ice Silk Anti-Bakteri",
    desc: "[Jenis Produk: Celana Dalam Pria]\nNama Produk: Celana Dalam Pria Boxer Katun Modal Ice Silk Anti-Bakteri 4-Way Stretch\n• Bahan & Elastisitas: Material katun modal ice silk ultra-lembut, elastisitas 4 arah (4-way stretch), sirkulasi udara mikro pori anti-lembab & anti-gerah seharian.\n• Karet Pinggang & Jahitan: Ban pinggang elastis tebal yang tidak melintir atau mencekik, jahitan flatlock kuat tidak gatal.\n• Desain: U-pouch 3D ergonomis leluasa bergerak, tidak nyeplak di celana luar.",
    imageUrl: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Shopee: Celana Dalam Wanita Seamless Invisible",
    platform: "shopee" as const,
    productType: "Celana Dalam Wanita",
    productName: "Celana Dalam Wanita Seamless Ice Silk Lembut Tanpa Bekas Garis",
    url: "https://shopee.co.id/Celana-Dalam-Wanita-Seamless-Ice-Silk-Lembut-i.5566778.889900",
    title: "Celana Dalam Wanita Seamless Ice Silk Lembut Tanpa Bekas Garis",
    desc: "[Jenis Produk: Celana Dalam Wanita]\nNama Produk: Celana Dalam Wanita Seamless Ice Silk Lembut Tanpa Bekas Garis\n• Bahan & Finishing: Ice silk seamless tanpa jahitan tepi (invisible edge), tidak berbekas atau nyeplak saat memakai celana atau rok ketat.\n• Lapisan Gusset: 100% serat katun antibakteri alami higienis menyerap kelembapan cepat bebas iritasi.\n• Elastisitas: Super ringan, elastis pas di pinggul tanpa menekan pinggang, sensasi sejuk seperti kulit kedua.",
    imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Shopee: Alat Pijat Elektrik Leher & Tubuh",
    platform: "shopee" as const,
    productType: "Alat Pijat Elektrik",
    productName: "Alat Pijat Elektrik Portabel Massage Gun Deep Tissue USB Rechargeable",
    url: "https://shopee.co.id/Alat-Pijat-Elektrik-Portabel-Massage-Gun-Deep-Tissue-i.8899112.223344",
    title: "Alat Pijat Elektrik Portabel Massage Gun Deep Tissue USB Rechargeable",
    desc: "[Jenis Produk: Alat Pijat Elektrik]\nNama Produk: Alat Pijat Elektrik Portabel Massage Gun Deep Tissue USB Rechargeable\n• Motor & Daya: Motor frekuensi tinggi berkecepatan multi-level menembus jaringan otot dalam meredakan kaku leher dan pegal punggung seketika.\n• Desain & Baterai: Nirkabel portabel ringan, baterai rechargeable USB Type-C tahan 4-6 jam penggunaan, pegangan ergonomis nyaman.",
    imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&auto=format&fit=crop&q=80",
  },
];

const PRODUCT_CATEGORIES = [
  {
    type: "Sandal",
    label: "🩴 Sandal / Selop",
    defaultName: "Sandal Selop EVA Empuk Anti Slip Pastel Tebal Nyaman",
    description: `[Jenis Produk: Sandal]
Nama Produk: Sandal Selop EVA Empuk Anti Slip Pastel Tebal Nyaman
• Spesifikasi & Bahan: Material karet EVA elastis premium tebal, bertekstur cushion empuk seperti bantal (meredam tekanan kaki saat melangkah).
• Sol & Ketebalan: Sol tebal 3.5 - 4 cm dengan tekstur wave anti-slip di bagian bawah, tidak licin di lantai ubin basah maupun kamar mandi.
• Keunggulan & Kenyamanan: Sangat ringan (~150 gram per pasang), tahan air dan cepat kering bebas bau apek, warna pastel estetik cocok untuk santai di rumah maupun bepergian.`,
  },
  {
    type: "Celana Dalam Pria",
    label: "🩲 Celana Dalam Pria",
    defaultName: "Celana Dalam Pria Boxer Katun Modal Ice Silk Anti-Bakteri 4-Way Stretch",
    description: `[Jenis Produk: Celana Dalam Pria]
Nama Produk: Celana Dalam Pria Boxer Katun Modal Ice Silk Anti-Bakteri 4-Way Stretch
• Bahan & Elastisitas: Material kain modal spandex katun ice silk ultra-lembut, elastis 4 arah (4-way stretch), sirkulasi udara mikro pori anti-lembab & anti-gerah seharian.
• Karet Pinggang & Jahitan: Ban pinggang elastis tebal yang tidak melintir atau mencekik perut, jahitan flatlock kuat tanpa tonjolan benang gatal.
• Keunggulan: Desain U-pouch 3D ergonomis memberikan ruang gerak leluasa, tidak nyeplak di celana luar, cepat kering dan antibakteri.`,
  },
  {
    type: "Celana Dalam Wanita",
    label: "👙 Celana Dalam Wanita",
    defaultName: "Celana Dalam Wanita Seamless Ice Silk Lembut Tanpa Bekas Garis",
    description: `[Jenis Produk: Celana Dalam Wanita]
Nama Produk: Celana Dalam Wanita Seamless Ice Silk Lembut Tanpa Bekas Garis
• Bahan & Finishing: Bahan seamless ice silk / katun premium tanpa jahitan tepi (seamless invisible), tidak berbekas atau nyeplak saat memakai celana/rok ketat.
• Lapisan Gusset: Lapisan dalam selangkangan 100% serat katun antibakteri alami, menyerap kelembapan dengan cepat dan menjaga area intim tetap higienis serta bebas iritasi.
• Elastisitas & Kenyamanan: Super ringan, elastis pas di pinggul tanpa menekan pinggang, sensasi sejuk lembut seperti kulit kedua.`,
  },
  {
    type: "Alat Pijat Elektrik",
    label: "💆 Alat Pijat Elektrik",
    defaultName: "Alat Pijat Elektrik Portabel Massage Gun Deep Tissue USB Rechargeable",
    description: `[Jenis Produk: Alat Pijat Elektrik]
Nama Produk: Alat Pijat Elektrik Portabel Massage Gun Deep Tissue USB Rechargeable
• Motor & Daya Pijat: Motor bertenaga frekuensi tinggi dengan beberapa tingkat intensitas getaran yang menembus jaringan otot dalam untuk meredakan nyeri pegal seketika.
• Desain & Ergonomis: Desain nirkabel portabel ringan, baterai rechargeable USB Type-C tahan hingga 4-6 jam penggunaan, pegangan ergonomis nyaman digenggam sendiri.`,
  },
  {
    type: "Bantal",
    label: "🛏️ Bantal Tidur",
    defaultName: "Bantal Tidur Hotel Silikon Grade A Super Empuk Anti-Kempes",
    description: `[Jenis Produk: Bantal]
Nama Produk: Bantal Tidur Hotel Silikon Grade A Super Empuk Anti-Kempes
• Spesifikasi & Isian: 100% serat silikon mikrofiber grade A empuk anti-kempes, elastisitas tinggi kembali mengembang seketika saat ditepuk.
• Ukuran & Bobot: Ukuran standar hotel 45 cm x 65 cm (berat ~850 gram), ergonomis menopang leher dan kepala bebas kaku leher.
• Kain Cover: Katun polymicro adem bersirkulasi udara tinggi dengan jahitan ganda rapi dan resleting samping.`,
  },
  {
    type: "Gorden",
    label: "🪟 Gorden Smokering",
    defaultName: "Gorden Blackout Smokering 12 Lubang Embos Mewah",
    description: `[Jenis Produk: Gorden]
Nama Produk: Gorden Blackout Smokering 12 Lubang Embos Mewah
• Spesifikasi & Bahan: Kain blackout impor tebal grade A premium (meredam sinar matahari dan silau hingga 90%).
• Ukuran & Ring: Lebar 140 cm x Tinggi 200 cm dengan 12 lubang ring smokering perak (6 gelembung lipatan rapi elegan).
• Keunggulan: Bahan tidak tembus pandang, kain halus jatuh tidak kaku, warna awet tidak luntur dicuci.`,
  },
  {
    type: "Sprei & Bedcover",
    label: "🛏️ Sprei & Bedcover",
    defaultName: "Sprei Katun Microtex Disperse Tebal Anti-Geser",
    description: `[Jenis Produk: Sprei & Bedcover]
Nama Produk: Sprei Katun Microtex Disperse Tebal Anti-Geser
• Material: Katun microtex disperse berkualitas tinggi, kerapatan serat rapat tidak mudah sobek, kain sangat halus dan adem di kulit.
• Fitur & Ukuran: Karet tebal anti-geser di keempat sudut, warna tajam tidak cepat pudar, bebas bulu halus.`,
  },
  {
    type: "Blender Portable",
    label: "🍹 Blender Portable",
    defaultName: "Blender Portable Mini Juicer USB 6 Pisau Kaca Borosilikat",
    description: `[Jenis Produk: Blender Portable]
Nama Produk: Blender Portable Mini Juicer USB 6 Pisau Kaca Borosilikat
• Spesifikasi Mesin & Pisau: 6 mata pisau baja stainless steel 304, motor 22.000 RPM mampu menghancurkan es batu dan buah segar.
• Baterai & Daya: Baterai isi ulang USB 2000 mAh tahan 10-15 kali blender sekali cas.
• Material: Kaca borosilikat food-grade tebal kapasitas 380ml anti-pecah mudah dicuci.`,
  },
  {
    type: "TWS Earphone",
    label: "🎧 TWS Earphone",
    defaultName: "TWS Wireless Earbuds Bluetooth 5.3 Low Latency Bass Booster",
    description: `[Jenis Produk: TWS Earphone]
Nama Produk: TWS Wireless Earbuds Bluetooth 5.3 Low Latency Bass Booster
• Audio & Koneksi: Bluetooth 5.3 koneksi stabil, driver 13mm deep bass solid dan ENC noise reduction telepon jernih.
• Baterai: Daya tahan earphone 6 jam non-stop, total 24 jam dengan charging case display digital LED.`,
  },
  {
    type: "Serum Wajah",
    label: "🧴 Serum Wajah",
    defaultName: "Brightening Face Serum Niacinamide 10% + Zinc 1% Pencerah Kulit",
    description: `[Jenis Produk: Serum Wajah]
Nama Produk: Brightening Face Serum Niacinamide 10% + Zinc 1% Pencerah Kulit
• Kandungan Aktif: 10% Pure Niacinamide, Hyaluronic Acid, dan 1% Zinc PCA untuk mencerahkan noda bekas jerawat dan mengontrol minyak.
• Tekstur & Formulasi: Cairan water-based ringan cepat meresap tanpa rasa lengket, bersertifikat resmi BPOM.`,
  },
  {
    type: "Panci & Wajan",
    label: "🍳 Panci & Wajan",
    defaultName: "Wajan Frypan Granit Anti Lengket Bebas PFOA Serbaguna",
    description: `[Jenis Produk: Panci & Wajan]
Nama Produk: Wajan Frypan Granit Anti Lengket Bebas PFOA Serbaguna
• Lapisan: Granit coating 5 layer anti lengket food grade, bebas PFOA aman untuk kesehatan keluarga.
• Kompatibilitas: Bottom induksi spiral menghantarkan panas merata, bisa untuk kompor gas maupun listrik.`,
  },
  {
    type: "Kipas Angin",
    label: "💨 Kipas Angin",
    defaultName: "Kipas Angin Mini Portable USB 3 Speed Super Silent",
    description: `[Jenis Produk: Kipas Angin]
Nama Produk: Kipas Angin Mini Portable USB 3 Speed Super Silent
• Fitur: 3 tingkat kecepatan hembusan angin sejuk, motor tembaga hening tanpa suara bising.
• Baterai: Rechargeable USB Type-C daya tahan hingga 8 jam pemakaian portable.`,
  },
];

export const PromptBuilderTab: React.FC<PromptBuilderTabProps> = ({
  onCampaignGenerated,
  showToast,
  currentCampaign,
}) => {
  // API Key State
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem("custom_gemini_api_key") || "";
  });
  const [apiStatus, setApiStatus] = useState<ApiKeyStatus>({ state: "idle" });

  // Upload & Form State
  const [imageBase64, setImageBase64] = useState<string>("");
  const [imageMimeType, setImageMimeType] = useState<string>("image/jpeg");
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
  const [imageFileName, setImageFileName] = useState<string>("");
  const [imageFileSize, setImageFileSize] = useState<string>("");
  const [productDescription, setProductDescription] = useState<string>(() => PRODUCT_CATEGORIES[0].description);

  // Product Link State (retained for backward compatibility)
  const [productLink, setProductLink] = useState<string>("");
  const [linkMetadata, setLinkMetadata] = useState<ProductLinkMeta | null>(() => ({
    platform: "shopee",
    productType: PRODUCT_CATEGORIES[0].type,
    productName: PRODUCT_CATEGORIES[0].defaultName,
    title: PRODUCT_CATEGORIES[0].defaultName,
    description: PRODUCT_CATEGORIES[0].description,
  }));
  const [isInspectingLink, setIsInspectingLink] = useState<boolean>(false);
  const [isFetchingLinkImage, setIsFetchingLinkImage] = useState<boolean>(false);
  const [isDetectingImage, setIsDetectingImage] = useState<boolean>(false);

  // Backend Analysis & Loading State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [lastLatencyMs, setLastLatencyMs] = useState<number | undefined>(undefined);
  const [generatedResults, setGeneratedResults] = useState<CampaignPrompts | null>(null);
  const [selectedConceptId, setSelectedConceptId] = useState<VideoConceptId>("social_proof");
  const [generationCount, setGenerationCount] = useState<number>(0);
  const [previousHooks, setPreviousHooks] = useState<string[]>([]);

  // AI Vision Auto-Detector for Uploaded Product Photo
  const handleDetectImageProduct = async (base64Data?: string, mime?: string, fileName?: string) => {
    const targetBase64 = base64Data || imageBase64;
    const targetMime = mime || imageMimeType || "image/jpeg";
    const targetFileName = fileName || imageFileName || "";
    if (!targetBase64) {
      showToast("Unggah foto produk terlebih dahulu.", "error");
      return;
    }

    setIsDetectingImage(true);
    showToast("🔍 AI Vision sedang menganalisis objek dalam foto...", "success");

    try {
      const resp = await fetch("/api/detect-image-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: targetBase64,
          mimeType: targetMime,
          apiKey: apiKey.trim() || undefined,
          productLink: productLink.trim() || undefined,
          currentDescription: productDescription.trim() || undefined,
          currentProductType: linkMetadata?.productType || undefined,
          imageFileName: targetFileName,
        }),
      });

      const data = await resp.json();
      if (!resp.ok || !data.success) {
        throw new Error(data.error || "Gagal menganalisis foto.");
      }

      // Update linkMetadata & productDescription to match what is seen in the photo!
      setLinkMetadata((prev) => ({
        url: prev?.url || productLink.trim() || undefined,
        platform: prev?.platform || "shopee",
        title: data.productName,
        productType: data.productType,
        productName: data.productName,
        description: data.description,
        imageUrl: prev?.imageUrl || "",
        isShortlinkProtected: false,
      }));

      setProductDescription(data.description);
      showToast(`✨ Foto teridentifikasi: [${data.productType}] ${data.productName}!`, "success");
    } catch (err: any) {
      console.warn("Detect image error:", err);
      showToast("Foto siap dianalisis. Anda juga bisa memilih tombol kategori di atas.", "info" as any);
    } finally {
      setIsDetectingImage(false);
    }
  };

  // File Upload Handlers
  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      showToast("Harap pilih file gambar (JPG, PNG, WEBP).", "error");
      return;
    }
    setImageFileName(file.name);
    setImageFileSize(`${(file.size / 1024).toFixed(1)} KB`);
    setImageMimeType(file.type);

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImagePreviewUrl(dataUrl);
      const base64 = dataUrl.split(",")[1];
      setImageBase64(base64);
      showToast("Foto produk berhasil dimuat. Mengidentifikasi objek...", "success");
      // Auto-detect product visually from photo!
      handleDetectImageProduct(base64, file.type, file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleResetUpload = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setImageBase64("");
    setImagePreviewUrl("");
    setImageFileName("");
    setImageFileSize("");
    setImageMimeType("image/jpeg");
  };

  const handleSelectDemoProduct = async (demo: typeof DEMO_PRODUCTS[0]) => {
    setProductDescription(demo.description);
    setImageFileName(`${demo.category.toLowerCase().replace(/\s+/g, "_")}.jpg`);
    setImageFileSize("Sample WebP");

    try {
      showToast(`Memuat sampel: ${demo.name}...`);
      const response = await fetch(demo.image);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setImagePreviewUrl(dataUrl);
        const base64 = dataUrl.split(",")[1];
        setImageBase64(base64);
        setImageMimeType(blob.type || "image/jpeg");
        showToast("Sampel foto produk siap dianalisis.");
        handleDetectImageProduct(base64, blob.type || "image/jpeg");
      };
      reader.readAsDataURL(blob);
    } catch {
      showToast("Gagal memuat gambar sampel online, silakan upload manual.", "error");
    }
  };

  // Inspect & Extract TikTok / Shopee Product Link
  const handleInspectLink = async (urlOverride?: string) => {
    const targetUrl = (urlOverride || productLink).trim();
    if (!targetUrl) {
      showToast("Masukkan URL link TikTok atau Shopee terlebih dahulu.", "error");
      return;
    }

    setIsInspectingLink(true);
    try {
      const resp = await fetch("/api/inspect-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: targetUrl,
          productType: linkMetadata?.productType || undefined,
          apiKey: apiKey.trim() || undefined,
        }),
      });

      const data = await resp.json();
      if (!resp.ok || !data.success) {
        throw new Error(data.error || "Gagal memeriksa link produk.");
      }

      const meta: ProductLinkMeta = {
        url: targetUrl,
        platform: data.platform || "other",
        title: data.title || data.productName || "Sandal Selop EVA Empuk Anti Slip",
        productType: data.productType || "Sandal",
        productName: data.productName || data.title || "Sandal Selop EVA Empuk Anti Slip",
        description: data.description || "",
        imageUrl: data.imageUrl || "",
        price: data.price,
        isShortlinkProtected: data.isShortlinkProtected,
      };

      setLinkMetadata(meta);

      // Auto-fill product description with verified detailed specs
      if (meta.description) {
        setProductDescription(meta.description);
      }

      const platformLabel = meta.platform === "tiktok" ? "TikTok Shop" : meta.platform === "shopee" ? "Shopee" : "E-Commerce";
      if (meta.isShortlinkProtected) {
        showToast(`Tautan terdeteksi dari ${platformLabel}. Kategori [${meta.productType}] & rincian spesifikasi siap dipakai!`, "success");
      } else {
        showToast(`Berhasil membaca [${meta.productType}] dari ${platformLabel}: "${meta.productName.slice(0, 35)}..."`, "success");
      }
    } catch (err: any) {
      console.error("Inspect link error:", err);
      showToast(err?.message || "Gagal membaca info dari link produk.", "error");
    } finally {
      setIsInspectingLink(false);
    }
  };

  // Quick Category Click
  const handleQuickSelectCategory = (cat: typeof PRODUCT_CATEGORIES[0]) => {
    const platform = productLink.includes("tiktok") ? "tiktok" : "shopee";
    const meta: ProductLinkMeta = {
      ...(linkMetadata || { platform, url: productLink.trim() || undefined }),
      productType: cat.type,
      productName: cat.defaultName,
      title: cat.defaultName,
      description: cat.description,
      isShortlinkProtected: linkMetadata?.isShortlinkProtected,
    };
    setLinkMetadata(meta);
    setProductDescription(cat.description);
    showToast(`Kategori produk disetel ke [${cat.type}]! Naskah bantal & deskripsi siap dibuat.`, "success");
  };

  // Update specific field in linkMetadata
  const handleUpdateMetadataField = (field: "productType" | "productName", val: string) => {
    if (!linkMetadata) {
      const meta: ProductLinkMeta = {
        platform: "shopee",
        productType: field === "productType" ? val : "Bantal",
        productName: field === "productName" ? val : "Bantal Tidur Hotel Silikon Grade A",
        title: val,
      };
      setLinkMetadata(meta);
      return;
    }
    const updated = { ...linkMetadata, [field]: val };
    if (field === "productName") updated.title = val;
    setLinkMetadata(updated);
  };

  // Preset Sample Link Click
  const handleSelectSampleLink = (sample: typeof SAMPLE_PRODUCT_LINKS[0]) => {
    setProductLink(sample.url);
    const meta: ProductLinkMeta = {
      url: sample.url,
      platform: sample.platform,
      title: sample.title,
      productType: sample.productType,
      productName: sample.productName,
      description: sample.desc,
      imageUrl: sample.imageUrl,
    };
    setLinkMetadata(meta);
    setProductDescription(sample.desc);
    showToast(`Sampel [${sample.productType}] dari ${sample.platform === "tiktok" ? "TikTok Shop" : "Shopee"} dimuat!`, "success");
  };

  // Fetch Image from inspected link
  const handleUseLinkImage = async () => {
    if (!linkMetadata?.imageUrl) {
      showToast("Link produk tidak memiliki URL gambar yang valid.", "error");
      return;
    }

    setIsFetchingLinkImage(true);
    try {
      showToast("Mengunduh foto dari link produk...");
      const resp = await fetch("/api/fetch-link-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: linkMetadata.imageUrl }),
      });

      const data = await resp.json();
      if (!resp.ok || !data.success) {
        throw new Error(data.error || "Gagal mengambil gambar dari link.");
      }

      setImageBase64(data.base64);
      setImageMimeType(data.mimeType || "image/jpeg");
      setImagePreviewUrl(`data:${data.mimeType || "image/jpeg"};base64,${data.base64}`);
      setImageFileName("foto_dari_link_produk.jpg");
      setImageFileSize("Dari Link Web");
      showToast("Foto produk dari link berhasil dipasang untuk analisis AI Vision!", "success");
    } catch (err: any) {
      console.error("Fetch link image error:", err);
      showToast(err?.message || "Gagal mengunduh foto produk dari link.", "error");
    } finally {
      setIsFetchingLinkImage(false);
    }
  };

  // Generate Prompts using Backend AI
  const handleAnalyzeAndGenerate = async () => {
    if (!imageBase64 && !productDescription.trim() && !linkMetadata?.productName) {
      showToast("Unggah foto produk atau pilih kategori terlebih dahulu sebelum menekan Buat Video Prompt.", "error");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    // Scroll to console smoothly
    setTimeout(() => {
      const consoleElem = document.getElementById("backend-analysis-monitor");
      if (consoleElem) {
        consoleElem.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 100);

    const nextAttempt = generationCount + 1;
    const seed = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

    try {
      const response = await fetch("/api/generate-prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: imageBase64 || undefined,
          mimeType: imageMimeType,
          productDescription,
          productLink: productLink.trim() || undefined,
          linkMetadata: linkMetadata || undefined,
          conceptId: selectedConceptId,
          apiKey: apiKey.trim() || undefined,
          generationAttempt: nextAttempt,
          randomSeed: seed,
          previousHooks: previousHooks.slice(-4),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Gagal memproses naskah dengan AI.");
      }

      const campaignData: CampaignPrompts = result.data;
      setGeneratedResults(campaignData);
      onCampaignGenerated(campaignData);
      setLastLatencyMs(result.meta?.latencyMs);
      setGenerationCount(nextAttempt);

      const newHook =
        campaignData.VIDEO_PROMPT_1?.story?.[0]?.voice_over ||
        campaignData.VIDEO_PROMPT_1?.scenes?.[0]?.vo ||
        "";
      if (newHook) {
        setPreviousHooks((prev) => [...prev, newHook].slice(-6));
      }
      
      if (result.meta?.isFallback) {
        showToast(`Variasi #${nextAttempt}: Hook & Naskah Baru berhasil disintesis via Fail-Safe Engine!`, "success");
      } else {
        showToast(`Variasi #${nextAttempt}: Hook & 3 Babak Video Baru berhasil dibuat!`, "success");
      }

      // Scroll to 3 Columns section
      setTimeout(() => {
        const colSection = document.getElementById("three-columns-output");
        if (colSection) {
          colSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 700);
    } catch (err: any) {
      console.error("AI Generation failed:", err);
      const msg = err?.message || "Terjadi kesalahan saat memanggil AI.";
      setAnalysisError(msg);
      showToast(msg, "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const displayedCampaign = generatedResults || currentCampaign;
  const hasInput = Boolean(imageBase64 || productDescription.trim() || linkMetadata?.productName);

  return (
    <div className="space-y-8">
      {/* SECTION 1: Connect API Key Card with Status Indicator */}
      <section id="api-key-section">
        <ApiKeyConnector
          apiKey={apiKey}
          onApiKeyChange={setApiKey}
          onStatusChange={setApiStatus}
        />
      </section>

      {/* SECTION 2: Product Categorization, Photo & Description Section */}
      <section className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs space-y-4 sm:space-y-6">
        <div className="border-b border-slate-100 pb-3 sm:pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
          <div>
            <h2 className="text-base sm:text-xl font-bold text-slate-900 flex items-center gap-1.5 sm:gap-2">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 shrink-0" />
              <span>Input &amp; Kurasi Produk Afiliasi</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5">
              Unggah foto produk langsung dari kamera HP atau galeri. AI Vision menganalisis objek visual secara presisi.
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
            <span className="text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 sm:py-1 bg-indigo-50 text-indigo-700 rounded-md sm:rounded-lg border border-indigo-200">
              Format: 3 Kolom Prompt JSON
            </span>
          </div>
        </div>

        {/* 2-COLUMN LAYOUT: Image Upload Box + Description & Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
          {/* LEFT COLUMN: Upload Box (5 cols) */}
          <div className="lg:col-span-5 space-y-2.5 sm:space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider">
                Foto Produk (Kamera HP / Galeri):
              </label>
              {imageBase64 && (
                <button
                  type="button"
                  onClick={handleResetUpload}
                  className="text-[11px] sm:text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>Hapus</span>
                </button>
              )}
            </div>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className={`relative w-full h-52 sm:h-64 border-2 border-dashed rounded-xl sm:rounded-2xl flex flex-col items-center justify-center p-3 sm:p-4 text-center transition overflow-hidden group ${
                imagePreviewUrl
                  ? "border-indigo-400 bg-slate-900"
                  : "border-slate-300 bg-slate-50/70 hover:bg-indigo-50/40 hover:border-indigo-400 cursor-pointer"
              }`}
            >
              {imagePreviewUrl ? (
                <div className="relative w-full h-full flex flex-col items-center justify-center">
                  <img
                    src={imagePreviewUrl}
                    alt="Preview Produk"
                    className="w-full h-36 sm:h-44 object-contain rounded-lg sm:rounded-xl"
                  />
                  <div className="w-full mt-2 bg-slate-800/90 text-slate-200 px-2.5 py-1.5 rounded-lg flex items-center justify-between text-[10px] sm:text-[11px]">
                    <span className="truncate max-w-[140px] sm:max-w-[180px] font-mono text-emerald-300 font-semibold">
                      {imageFileName || "product_image.jpg"}
                    </span>
                    <span className="text-slate-400">{imageFileSize}</span>
                    <label
                      htmlFor="reupload-input"
                      className="cursor-pointer text-indigo-300 hover:text-white font-bold ml-2 underline shrink-0"
                    >
                      Ganti
                    </label>
                    <input
                      id="reupload-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFile(e.target.files[0]);
                        }
                      }}
                    />
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="file-input"
                  className="cursor-pointer w-full h-full flex flex-col items-center justify-center"
                >
                  <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition shadow-xs">
                    <Upload className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    Pilih Foto Produk
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">
                    JPG, PNG, WEBP dari kamera HP atau galeri
                  </p>
                  <span className="mt-2.5 px-3 py-1 bg-white border border-slate-300 rounded-lg sm:rounded-xl text-[11px] font-bold text-indigo-600 shadow-2xs group-hover:bg-indigo-50 transition">
                    Buka File / Kamera
                  </span>
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFile(e.target.files[0]);
                      }
                    }}
                  />
                </label>
              )}
            </div>

            {/* AI Vision Re-detect Button */}
            {imagePreviewUrl && (
              <button
                type="button"
                id="btn-detect-image-product"
                onClick={() => handleDetectImageProduct()}
                disabled={isDetectingImage}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition disabled:opacity-50"
              >
                {isDetectingImage ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>AI Vision Menganalisis...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Deteksi Ulang dari Foto (AI Vision)</span>
                  </>
                )}
              </button>
            )}

            {/* Instant Demo Presets */}
            <div className="space-y-1 pt-0.5">
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 block">
                Atau coba sampel cepat:
              </span>
              <div className="flex flex-wrap gap-1">
                {DEMO_PRODUCTS.map((demo, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectDemoProduct(demo)}
                    className="text-[10px] sm:text-[11px] px-2 py-0.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-md border border-slate-200 transition font-medium"
                  >
                    {demo.category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Notes & Analyze & Generate Button (7 cols) */}
          <div className="lg:col-span-7 space-y-3 sm:space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label
                  htmlFor="product-description-input"
                  className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider"
                >
                  Deskripsi / Spesifikasi Produk (Naskah VO):
                </label>
              </div>
              <textarea
                id="product-description-input"
                rows={3}
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder="Deskripsi produk otomatis terisi saat foto dianalisis AI Vision, atau ketik keunggulan spesifik di sini..."
                className="w-full p-3 border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition resize-none bg-slate-50/50"
              />
              <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">
                AI menyusun narasi Voice Over berdasarkan poin nyata di sini (disiplin ketat 6-8 kata/adegan).
              </p>
            </div>

            {/* Summary Rules Verification */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[10px] sm:text-[11px] text-slate-600 space-y-1">
              <p className="font-bold text-slate-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Standar Otomatis Output 3 Kolom:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-0.5 pl-3.5 list-disc text-slate-600 text-[10px] sm:text-[11px]">
                <li>3 Kolom Prompt JSON bersambung.</li>
                <li>Suara: Wanita 18th Jawa (tempo affiliate).</li>
                <li>5 adegan (2 detik/adegan), 6-8 kata VO.</li>
                <li>Visual clean footage (zero overlay).</li>
                <li>CTA verbal dikunci di Prompt 3 (8-10s).</li>
                <li>Produk 100% identik dengan foto referensi.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FULL-WIDTH VIDEO CONCEPT SELECTOR */}
        <div className="border-t border-slate-200 pt-4 sm:pt-6">
          <VideoConceptSelector
            selectedConceptId={selectedConceptId}
            onSelectConcept={setSelectedConceptId}
          />
        </div>

        {/* MANDATED BUTTON: ANALYZE & GENERATE */}
        <div className="pt-1 sm:pt-2 space-y-2">
          <button
            type="button"
            id="btn-analyze-generate"
            onClick={handleAnalyzeAndGenerate}
            disabled={isAnalyzing || !hasInput}
            className={`w-full py-3.5 sm:py-4 px-4 sm:px-6 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition shadow-md active:scale-[0.99] ${
              isAnalyzing || !hasInput
                ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 hover:shadow-indigo-300"
            }`}
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin shrink-0" />
                <span className="truncate">AI Sedang Merancang Variasi Baru...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 shrink-0" />
                <span className="truncate">
                  {generationCount > 0
                    ? `Analyze & Hook Baru (Variasi #${generationCount + 1})`
                    : `Analyze & Generate 3 Kolom Prompts`}
                </span>
              </>
            )}
          </button>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-1 text-[10px] sm:text-xs text-slate-500 px-0.5">
            <span className="flex items-center gap-1 text-emerald-700 font-medium bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>Tiap klik menghasilkan Hook &amp; VO baru</span>
            </span>
            {generationCount > 0 && (
              <span className="text-indigo-700 font-medium">
                Telah dibuat: {generationCount} variasi unik
              </span>
            )}
          </div>

          {!hasInput && (
            <p className="text-center text-[10px] sm:text-[11px] text-slate-400 mt-0.5">
              * Unggah foto produk atau isi deskripsi untuk mengaktifkan generator.
            </p>
          )}
        </div>
      </section>

      {/* SECTION 3: LAYAR ANALISIS BACKEND AI (Live Backend Monitor) */}
      <section id="backend-analysis-monitor" className="space-y-2">
        <BackendAnalysisConsole
          isAnalyzing={isAnalyzing}
          error={analysisError}
          latencyMs={lastLatencyMs}
          productName={linkMetadata?.title || imageFileName || productDescription || "Produk Affiliate"}
          productLink={productLink.trim() || undefined}
          linkPlatform={linkMetadata?.platform}
          linkTitle={linkMetadata?.title}
          onRetry={handleAnalyzeAndGenerate}
        />
      </section>

      {/* SECTION 4: 3-COLUMN PROMPT JSON DISPLAY WITH COPY & PLAY VOICE OVER */}
      <section id="three-columns-output" className="pt-2">
        <ThreeColumnPrompts
          campaign={displayedCampaign}
          onCopyNotice={(msg) => showToast(msg, "success")}
        />
      </section>
    </div>
  );
};
