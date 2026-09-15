import { VideoConceptOption, VideoConceptId } from "../types";

export const VIDEO_CONCEPTS: VideoConceptOption[] = [
  {
    id: "social_proof",
    title: "Social Proof / Kerumunan Toko",
    subtitle: "P1 — BIKIN ORANG BERHENTI & REBUTAN DI DISPLAY TOKO",
    tag: "Social Proof Hook",
    badge: "Paling Viral di TikTok",
    accentColor: "indigo",
    hookThreeSeconds: "Kamera masuk ke toko retail ramai; sekelompok ibu-ibu/pembeli spontan berkerumun di display produk berebut memegang dan membandingkan warna. VO: 'Gila, baru masuk toko ibu-ibu langsung ngumpul!'",
    p1Summary: "Crowd Frenzy di Toko: Puluhan pembeli berkumpul spontan di display, memicu rasa penasaran & bukti sosial tinggi.",
    p2Summary: "Tes Tekstur & Kenyamanan: Uji kelenturan, ketebalan bantalan, cengkeraman anti-slip langsung dicoba di toko.",
    p3Summary: "Review di Rumah & Closing CTA: Unboxing varian warna di rumah, pembuktian keawetan, dan ajakan checkout sebelum stok ludes.",
    bestFor: "Fashion, sandal/sepatu, aksesoris retail & produk trending",
  },
  {
    id: "stress_test",
    title: "Uji Durabilitas Ekstrem / Stress Test",
    subtitle: "P1 — TES KETAHANAN BRUTAL & TANPA AMPUN",
    tag: "Torture Test Hook",
    badge: "Retensi Penonton Tertinggi",
    accentColor: "rose",
    hookThreeSeconds: "Aksi ekstrem langsung di detik ke-0: produk ditekuk 360°, diinjak kendaraan, atau disiram cairan kopi/kotor. VO: 'Jangan kaget rek, ini sengaja tak siksa biar kalian percaya!'",
    p1Summary: "Uji Siksa Brutal: Pengujian fisik ekstrem yang membuat mata penonton terbelalak dan langsung berhenti scroll.",
    p2Summary: "Cek Fisik 100% Utuh: Inspeksi detail membuktikan produk kembali ke bentuk semula tanpa robek, retak, atau lecet.",
    p3Summary: "Jaminan Kualitas & CTA Promo: Ulasan rasa puas pemakaian jangka panjang dan desakan amankan harga promo diskon.",
    bestFor: "Sandal badak, casing HP, tas waterproof & perabot kuat",
  },
  {
    id: "unboxing_viral",
    title: "Unboxing Paket Viral & Reaksi Syok",
    subtitle: "P1 — BUKA PAKET VIRAL DENGAN REAKSI KAGET",
    tag: "Curiosity & Mystery",
    badge: "Formula FYP Affiliate",
    accentColor: "amber",
    hookThreeSeconds: "Creator buru-buru merobek lakban paket belanjaan viral dengan ekspresi syok melihat kemewahan barangnya. VO: 'Akhirnya paket viral yang bikin penasaran se-Indonesia mendarat!'",
    p1Summary: "Unboxing Spontan: Membuka kemasan paket dengan antusiasme tinggi, menunjukkan bentuk fisik produk yang mengejutkan.",
    p2Summary: "Pembuktian Klaim Viral: Menguji fitur utama produk satu per satu dan membandingkan kualitasnya dengan barang murahan.",
    p3Summary: "FOMO Stok Menipis: Menunjukkan kupon diskon toko yang segera habis dan dorongan segera checkout sekarang juga.",
    bestFor: "Gadget unik, kosmetik viral, hampers & barang baru launching",
  },
  {
    id: "problem_solution",
    title: "Drama Masalah Harian & Solusi Instan",
    subtitle: "P1 — KELUHAN NYATA YANG BIKIN JENGKEL & PENYELAMAT INSTAN",
    tag: "Problem-Agitation-Solution",
    badge: "Konversi Tertinggi",
    accentColor: "emerald",
    hookThreeSeconds: "Visual ekspresi frustrasi/tersiksa menghadapi masalah sehari-hari (kaki sakit, lantai licin, ruangan gerah/silau). VO: 'Kapok rek, kemarin sempat ngerasain kesiksa begini tiap hari!'",
    p1Summary: "Masalah Sangat Relatable: Mengangkat momen penderitaan sehari-hari yang langsung menyentuh emosi penonton.",
    p2Summary: "Transformasi Seketika: Begitu produk digunakan, masalah lenyap total dan rasa nyaman luar biasa langsung hadir.",
    p3Summary: "Rekomendasi Wajib Punya: Ajakan tulus menyelamatkan diri dan keluarga dengan solusi ini sebelum harga naik.",
    bestFor: "Alat kesehatan, perlengkapan rumah tangga & solusi pegal/nyeri",
  },
];

export function getVideoConceptById(id: VideoConceptId): VideoConceptOption {
  return VIDEO_CONCEPTS.find((c) => c.id === id) || VIDEO_CONCEPTS[0];
}
