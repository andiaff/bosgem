import { CampaignPrompts } from "../types";

export const DEFAULT_LOCKED_VOICEOVER = {
  gender_age_accent: "Female, 18 yo, Javanese-Indonesian accent",
  style: "Hyper-energetic, aggressive TikTok affiliate selling. Very fast Indonesian delivery with a natural East Javanese accent. Use standard Indonesian mainly. Lightly use 'rek', 'pol', or 'tenan'.",
  intonation: "Energetic pitch changes, strong emphasis on product benefits, excited reactions, fast rhythm, confident selling energy.",
  tempo: "Very fast TikTok Affiliate delivery, approximately 3-4 words per second.",
  delivery: "Short punchy phrases connected naturally with minimal dead air.",
  continuity: "All scenes and all three prompts use the exact same female voice, age, accent, vocal character, speaking energy, rhythm and personality. All three prompts sound like the exact same affiliate creator continuing one connected conversation."
};

export const INITIAL_CAMPAIGN: CampaignPrompts = {
  VIDEO_PROMPT_1: {
    prompt_type: "Curiosity & Discovery",
    duration: "10 Detik",
    product: "Alat Pemotong Sayur Multifungsi 12-in-1 dengan wadah transparan 1.5L dan bilah stainless steel",
    creative_concept: "Discovery di area dapur rumah sederhana. Creator secara tidak sengaja menemukan alat pemotong serbaguna di antara tumpukan belanjaan pasar.",
    continuity: "Area dapur rumah Indonesia, kompor dua tungku, keramik putih sederhana. Karakter: Wanita 18 tahun, kaos oblong santai, rambut kuncir acak.",
    visual_style: "Raw UGC Dokumenter Realis. Rekaman kamera HP genggam sedikit bergoyang, pencahayaan lampu dapur alami tanpa filter atau lampu studio.",
    voice_over: DEFAULT_LOCKED_VOICEOVER,
    cta: "TIDAK ADA CTA (Dilarang di Prompt 1)",
    negative_constraints: [
      "No text overlays or captions",
      "No TikTok or Shopee UI elements",
      "No stickers or emojis",
      "No keranjang kuning mention",
      "No studio lights"
    ],
    scenes: [
      {
        time: "0-2s",
        visual: "Close-up ekstrem wajah creator kaget, lalu kamera pan cepat ke alat pemotong sayur plastik tebal dengan wadah transparan di meja dapur.",
        vo: "Sumpah rek, aku kaget banget nemu ginian!",
        words: 7
      },
      {
        time: "2-4s",
        visual: "Tangan creator langsung menyambar alat pemotong, mengangkat wadah transparan memperlihatkan bilah pisau stainless steel ke lensa kamera.",
        vo: "Barang viral ini kok bisa nyasar di dapurku?",
        words: 8
      },
      {
        time: "4-6s",
        visual: "Creator menekan tuas penekan hijau di atas pisau grid, menunjukkan mekanisme per pegas dengan latar belakang dapur asli.",
        vo: "Katanya sih ini solusi mantep pol buat masak.",
        words: 8
      },
      {
        time: "6-8s",
        visual: "Creator mengetuk wadah akrilik dengan kuku menunjukkan ketebalan bahan dan karet anti-slip di bagian bawah.",
        vo: "Ternyata bahannya tebel dan nggak kaleng-kaleng loh!",
        words: 7
      },
      {
        time: "8-10s",
        visual: "Creator mendadak meraih kentang dan wortel dari keranjang sayur di sampingnya, bersiap melakukan pengujian langsung.",
        vo: "Bentar, aku mau langsung tes beneran seampuh apa!",
        words: 8
      }
    ]
  },
  VIDEO_PROMPT_2: {
    prompt_type: "Demonstration & Reaction",
    duration: "10 Detik",
    product: "Alat Pemotong Sayur Multifungsi 12-in-1 dengan wadah transparan 1.5L dan bilah stainless steel",
    creative_concept: "Pengujian pemotongan langsung tanpa jeda rekayasa di atas meja dapur. Reaksi takjub alami saat sayuran terpotong rapi dalam satu detik.",
    continuity: "Area dapur yang sama, pakaian dan karakter yang persis sama. Sayuran asli (wortel dan kentang segar).",
    visual_style: "Raw UGC Dokumenter Realis. Kamera HP dipegang satu tangan, merekam interaksi pemotongan sangat dekat (extreme close-up).",
    voice_over: DEFAULT_LOCKED_VOICEOVER,
    cta: "TIDAK ADA CTA (Dilarang di Prompt 2)",
    negative_constraints: [
      "No text overlays",
      "No fake CGI cuts",
      "No keranjang kuning mention",
      "No watermark"
    ],
    scenes: [
      {
        time: "0-2s",
        visual: "Creator meletakkan separuh kentang di atas bilah pisau kotak, lalu menekan penutupnya dengan satu hentakan tangan tegas.",
        vo: "Langsung aja kita buktiin sekarang juga, tanpa rekayasa!",
        words: 8
      },
      {
        time: "2-4s",
        visual: "Kentang langsung terpotong dadu sempurna jatuh ke dalam wadah bening dalam sekejap, kamera merekam dari sisi samping transparan.",
        vo: "Cuma ditekan sekali langsung kepotong kotak rapi rek!",
        words: 8
      },
      {
        time: "4-6s",
        visual: "Creator mengganti mata pisau tipis khusus timun dengan gerakan cepat, lalu menggesek timun menghasilkan irisan tipis presisi.",
        vo: "Loh, ganti pisaunya gampang dan cepet tenan!",
        words: 7
      },
      {
        time: "6-8s",
        visual: "Kamera beralih ke ekspresi wajah creator yang melongo takjub sambil mengangkat wadah penuh irisan sayuran segar.",
        vo: "Pantesan ini barang seliweran terus di FYP kalian.",
        words: 7
      },
      {
        time: "8-10s",
        visual: "Close-up tangan creator membilas pisau stainless steel di bawah kucuran air keran wastafel, sisa sayuran langsung luruh bersih.",
        vo: "Dibilas air langsung bersih nggak ribet sama sekali!",
        words: 8
      }
    ]
  },
  VIDEO_PROMPT_3: {
    prompt_type: "Social Proof & Urgency",
    duration: "10 Detik",
    product: "Alat Pemotong Sayur Multifungsi 12-in-1 dengan wadah transparan 1.5L dan bilah stainless steel",
    creative_concept: "Menyadarkan nilai hemat waktu & dorongan FOMO dengan menunjukkan tumpukan kardus paket di sudut ruangan dan CTA tegas di detik penutup.",
    continuity: "Masih di rumah yang sama, creator melangkah ke depan pintu ruang depan memperlihatkan tumpukan paket pengiriman kardus.",
    visual_style: "Raw UGC Dokumenter Realis. Pergerakan kamera dinamis menunjukkan kontras produk dan tumpukan paket.",
    voice_over: DEFAULT_LOCKED_VOICEOVER,
    cta: "Jangan sampai nyesel, buruan amankan stoknya sekarang sebelum kehabisan!",
    negative_constraints: [
      "No floating text or price badges",
      "No keranjang kuning phrase (strictly verbal CTA)",
      "No emojis"
    ],
    scenes: [
      {
        time: "0-2s",
        visual: "Kamera pan cepat dari alat pemotong di tangan creator ke tumpukan kardus paket pengiriman di lantai samping pintu.",
        vo: "Pantesan tetanggaku pada borong sampai numpuk begini!",
        words: 7
      },
      {
        time: "2-4s",
        visual: "Creator memegang produk dekat wajahnya sambil geleng-geleng kepala menunjuk ke kardus paket di belakangnya.",
        vo: "Kualitas pisau sebagus ini harganya murah pol sih!",
        words: 8
      },
      {
        time: "4-6s",
        visual: "Creator merapatkan bilah pisau dan wadah menjadi satu kesatuan rapi, memperlihatkan kepraktisan penyimpanan di lemari.",
        vo: "Bikin masak jadi sat-set hemat waktu banget rek.",
        words: 8
      },
      {
        time: "6-8s",
        visual: "Creator memegang produk dengan kedua tangan menghadap kamera, tersenyum mantap dengan latar ruang tengah.",
        vo: "Mumpung lagi ada promo gila dan bisa COD.",
        words: 8
      },
      {
        time: "8-10s",
        visual: "Creator menatap tajam ke lensa kamera dan memberi isyarat tangan lugas agar penonton langsung melakukan pemesanan saat ini juga.",
        vo: "Jangan sampai nyesel, buruan amankan stoknya sekarang!",
        words: 7
      }
    ]
  }
};

export const CREATIVE_RULES = [
  {
    id: 1,
    title: "Aturan Frame 0-Detik (Visual Hook)",
    tag: "Visual Hook",
    description: "Frame pertama pada detik ke-0 WAJIB memicu rasa penasaran seketika. Hindari pembuka lambat seperti berjalan masuk ruangan, ruangan kosong tanpa manusia, atau produk diam di meja tanpa interaksi.",
    color: "indigo"
  },
  {
    id: 2,
    title: "Akurasi Dimensi Fisik Produk (Product Accuracy)",
    tag: "Accuracy",
    description: "Deskripsi visual adegan WAJIB akurat dengan ukuran, dimensi, warna, dan material produk di foto. Dilarang melebih-lebihkan ukuran atau mengarang fitur fisik yang tidak nyata.",
    color: "emerald"
  },
  {
    id: 3,
    title: "Scroll Stopper 3-Detik Pertama",
    tag: "Retention",
    description: "Kalimat pembuka (hook) WAJIB bersinkronisasi 100% dengan aksi visual. Jika visual menunjukkan dapur berantakan atau sayur berserakan, voiceover harus langsung membahas kondisi tersebut.",
    color: "amber"
  },
  {
    id: 4,
    title: "Aturan CTA Terkunci di Akhir Video (No Early Selling)",
    tag: "Conversion",
    description: "DILARANG KERAS menyebutkan ajakan beli, cek keranjang, atau checkout di Prompt 1 dan Prompt 2. Call-To-Action HANYA boleh diucapkan pada 2 detik terakhir (8-10s) Prompt 3!",
    color: "rose"
  },
  {
    id: 5,
    title: "Larangan Frasa Platform (No 'Keranjang Kuning')",
    tag: "Policy",
    description: "Dilarang menyebut tombol spesifik antarmuka aplikasi seperti 'keranjang kuning' atau 'klik link bio'. Gunakan CTA verbal murni yang alami (contoh: 'Buruan amankan stoknya sekarang!').",
    color: "purple"
  },
  {
    id: 6,
    title: "Kebersihan Visual 100% (Visual Cleanliness)",
    tag: "Clean Footage",
    description: "Rekaman visual harus 100% murni rekaman kamera dunia nyata. DILARANG memunculkan teks tempel (text overlay), logo TikTok/Shopee, watermark, stiker, atau elemen UI melayang.",
    color: "cyan"
  },
  {
    id: 7,
    title: "Disiplin Durasi 2-Detik (6-8 Kata Per Klip)",
    tag: "Pacing",
    description: "Setiap adegan berdurasi tepat 2 detik. Naskah voiceover harus berisi tepat 6-8 kata bahasa Indonesia agar pas dengan tempo bicara 3-4 kata/detik tanpa terpotong atau hening (zero dead-air).",
    color: "blue"
  },
  {
    id: 8,
    title: "Karakter Suara Terkunci (Locked Persona Continuity)",
    tag: "Persona",
    description: "Identitas suara wanita 18 tahun dengan aksen Jawa-Indonesia natural ('rek', 'pol', 'tenan') tidak boleh berubah di ketiga video agar penonton merasakan kontinuitas kreator yang sama.",
    color: "pink"
  },
  {
    id: 9,
    title: "Realisme Dokumenter UGC Raw",
    tag: "Authenticity",
    description: "Visual harus mencerminkan rekaman HP asli: pergerakan kamera genggam sedikit bergoyang, pencahayaan alami rumah kelas menengah Indonesia, dan reaksi manusia yang tidak berlebihan.",
    color: "teal"
  },
  {
    id: 10,
    title: "Anti-Repetition Hook Engine",
    tag: "Freshness",
    description: "Hindari pembuka klise basi seperti 'Gila guys...', 'Wajib tahu...', atau 'Racun TikTok...'. Setiap produk harus menggunakan variasi mekanisme kejutan visual yang segar.",
    color: "orange"
  },
  {
    id: 11,
    title: "Keselarasan Lingkungan Spesifik",
    tag: "Context",
    description: "Tempat pengambilan gambar harus sesuai dengan fungsi produk (misal: produk dapur di dapur rumah nyata, skincare di wastafel kamar mandi, alat kebersihan di kamar tidur).",
    color: "slate"
  },
  {
    id: 12,
    title: "Zero Emoji & Icon Rule",
    tag: "Prompt Cleanliness",
    description: "Output prompt naskah JSON dilarang menyertakan simbol emoji atau ikon visual apa pun. Seluruh teks harus berupa karakter alfabetik bersih yang siap di-copy ke AI video generator.",
    color: "red"
  }
];

export const DEMO_PRODUCTS = [
  {
    name: "Alat Pemotong Sayur 12-in-1 Multifungsi",
    category: "Peralatan Dapur",
    image: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&auto=format&fit=crop&q=80",
    description: "Pemotong sayur plastik tebal warna hijau toska dengan wadah bening akrilik 1.5 liter dan bilah pisau grid stainless steel anti-karat."
  },
  {
    name: "Serum Retinol Niacinamide Glowing",
    category: "Kecantikan & Skincare",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
    description: "Botol serum kaca amber gelap 30ml dengan pipet tetes hitam, tekstur gel transparan kental tidak lengket untuk mencerahkan kulit."
  },
  {
    name: "Mini Bluetooth Speaker TWS Waterproof",
    category: "Gadget & Elektronik",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80",
    description: "Speaker silinder mini seukuran telapak tangan dengan tali gantungan karet, bodi matte hitam doff dengan lampu indikator LED biru redup."
  }
];
