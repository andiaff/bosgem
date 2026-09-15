// Fail-safe generator in case Gemini API experiences 503 High Demand or quota limits
// Adapts dynamically to ANY product, the chosen video concept, AND guarantees FRESH, NOVEL HOOKS on every run!
// Guarantees 4K Ultra HD, 9:16 aspect ratio, clean frames, and 0-3s hook stopping scroll!

interface VariationItem {
  time: string;
  visual: string;
  voice_over: string;
}

interface CampaignVariation {
  title: string;
  concept: string;
  p1: VariationItem[];
  p2: VariationItem[];
  p3: VariationItem[];
  cta: string;
}

export function generateFailSafeCampaign(
  productDescription?: string,
  productLink?: string,
  linkTitle?: string,
  explicitType?: string,
  conceptId: string = "social_proof",
  generationAttempt: number = 1,
  previousHooks: string[] = []
): any {
  const combinedText = `${explicitType || ""} ${linkTitle || ""} ${productDescription || ""} ${productLink || ""}`.toLowerCase();

  // Detect product type
  let productType = explicitType || "Sandal";
  if (combinedText.includes("celana dalam pria") || combinedText.includes("boxer pria") || combinedText.includes("boxer") || combinedText.includes("cd pria")) {
    productType = "Celana Dalam Pria";
  } else if (combinedText.includes("celana dalam wanita") || combinedText.includes("cd wanita") || combinedText.includes("seamless panties") || combinedText.includes("underwear women") || combinedText.includes("panties")) {
    productType = "Celana Dalam Wanita";
  } else if (combinedText.includes("alat pijat") || combinedText.includes("massage gun") || combinedText.includes("pijat elektrik")) {
    productType = "Alat Pijat Elektrik";
  } else if (combinedText.includes("sandal") || combinedText.includes("sendal") || combinedText.includes("selop") || combinedText.includes("slipper")) {
    productType = "Sandal";
  } else if (combinedText.includes("gorden") || combinedText.includes("korden") || combinedText.includes("curtain") || combinedText.includes("tirai")) {
    productType = "Gorden";
  } else if (combinedText.includes("bantal") || combinedText.includes("pillow") || combinedText.includes("guling")) {
    productType = "Bantal";
  } else if (combinedText.includes("blender") || combinedText.includes("juicer") || combinedText.includes("chopper")) {
    productType = "Blender Portable";
  } else if (combinedText.includes("serum") || combinedText.includes("skincare") || combinedText.includes("toner")) {
    productType = "Serum Wajah";
  } else if (combinedText.includes("tws") || combinedText.includes("earphone") || combinedText.includes("headset")) {
    productType = "TWS Earphone";
  } else if (combinedText.includes("panci") || combinedText.includes("wajan") || combinedText.includes("teflon")) {
    productType = "Panci & Wajan";
  } else if (combinedText.includes("kipas") || combinedText.includes("fan")) {
    productType = "Kipas Angin";
  }

  const productName = linkTitle || `Produk Pilihan ${productType}`;
  const fullProduct = `[Jenis Produk: ${productType}] ${productName} - ${productDescription || "Material berkualitas tinggi, desain ergonomis tahan lama"}`;

  const voiceIdentity = {
    gender_age_accent: "Female, 18 years old, Javanese-Indonesian accent",
    style: "Hyper-energetic, aggressive TikTok affiliate selling, curiosity-inducing and spontaneous. Very fast Indonesian delivery with a noticeable natural East Javanese accent. Use standard Indonesian mainly. Lightly use 'rek', 'pol', or 'tenan' only when naturally appropriate and never repeatedly.",
    tempo: "Approximately 3-4 words per second while remaining intelligible.",
    intonation: "Energetic pitch changes, strong emphasis on curiosity and product benefits, excited reactions, confident selling energy.",
    continuity_lock: "Exactly the same female voice identity, age, accent, pitch, rhythm and vocal character throughout P1, P2 and P3. Sounds like the same 18-year-old creator speaking across all three videos."
  };

  const characterBehavior = {
    rule: "All people remain silent on camera.",
    no_lip_sync: true,
    communication: "All spoken content comes exclusively from the female external voice-over.",
    shoppers: "Natural shopping or testing behavior. No one looks directly into the lens or acts like they are in a commercial."
  };

  const absoluteCleanFrame = {
    rule: "The generated video must contain absolutely no visible text or digital interface.",
    forbidden: [
      "no text overlays, subtitles, captions, or typography of any kind",
      "no TikTok, Shopee, or any social-media UI elements, buttons, icons, or navigation bars",
      "no prices, discount tags, sales stickers, star ratings, or promo badges",
      "no watermarks, logos, brand emblems, or channel identifiers",
      "no artificial digital graphics, arrows, circles, animated stickers, or emojis",
      "no floating product labels or callout bubbles",
      "no split-screen borders, picture-in-picture frames, or artificial overlays",
      "no studio lighting equipment, softboxes, ring lights, or camera rigs visible in frame"
    ]
  };

  const hardFailConditions = [
    "Any text, graphic, logo, watermark, or UI element appearing in any frame is an immediate hard fail.",
    "Any person on camera moving their lips or appearing to speak is an immediate hard fail.",
    "Any deviation from the reference product's shape, sole, or construction is an immediate hard fail.",
    "Any illogical drama or inappropriate physical test not fitting the product (e.g. underwear dropped from stairs, claim 'tidak patah' for cloth, or water puddles for underwear) is an immediate hard fail.",
    "Any unrealistic packaging proportion (e.g. small box for pillows or giant box for lipstick) is an immediate hard fail.",
    "Any CGI, 3D model, or artificial commercial rendering style is an immediate hard fail.",
    "Any scene feeling staged, rehearsed, or filmed as a corporate TV commercial is an immediate hard fail."
  ];

  const visualStyle = "RAW Indonesian social-media documentary realism, authentic handheld smartphone-camera perspective without showing the smartphone, natural Indonesian lighting, realistic human movement, believable shopping behavior, realistic textile and rubber material, energetic TikTok pacing, not polished luxury advertising.";

  const productPreserve = [
    `authentic ${productType.toLowerCase()} form factor and silhouette`,
    "exact material texture and visible surface construction",
    "correct adult proportions and functional components",
    "true color family shown in the reference image",
    "matte or natural finish without artificial gloss or CGI render"
  ];

  const colors = ["navy", "soft pink", "cream", "grey", "hitam matte"];

  const makeScenes = (story: VariationItem[]) =>
    story.map((s) => ({
      time: s.time,
      visual: s.visual,
      vo: s.voice_over,
      voice_over: s.voice_over,
      words: s.voice_over.trim().split(/\s+/).filter(Boolean).length
    }));

  // Build product-specific or category-appropriate variations
  let activePool: CampaignVariation[] = [];

  // =========================================================================
  // 1. CONCEPT: STRESS TEST / TORTURE TEST (Strictly logically aligned)
  // =========================================================================
  if (conceptId === "stress_test") {
    if (productType === "Celana Dalam Pria") {
      activePool = [
        {
          title: `P1 — UJI TARIK 4 ARAH & KARET ANTI-MELINTIR`,
          concept: `Aggressive 4-way stretch test of men's underwear waistband and seam resilience.`,
          p1: [
            { time: "0-2s", visual: `SHOCKING STRETCH HOOK. Two hands violently pull the waistband of ${productName} apart horizontally to maximum stretch under bright light.`, voice_over: "Jangan kaget rek, ini sengaja tak tarik pol!" },
            { time: "2-4s", visual: "Waistband is snapped back repeatedly; elastic waistband does not roll, twist, or lose shape.", voice_over: "Karet pinggangnya tebal nggak bakal melintir bikin sesak!" },
            { time: "4-6s", visual: "Scratching the inner modal fabric with fingers vigorously; zero pilling or loose threads.", voice_over: "Bahan ice silk sejuk anti brudul digosok kasar!" },
            { time: "6-8s", visual: "Holding U-pouch fabric up to bright lamp showing micro-porous breathable ventilation.", voice_over: "Pori-pori sirkulasinya adem bikin bebas gerah seharian!" },
            { time: "8-10s", visual: "Releasing, underwear rests completely smooth and pristine without any deformation.", voice_over: "Lihat bentuk fisiknya tetap mulus seratus persen!" }
          ],
          p2: [
            { time: "0-2s", visual: `Macro close-up along flatlock seams and inner hygiene gusset. Zero torn stitches.`, voice_over: "Jahitan flatlock rapi kuat nggak bikin kulit gatal!" },
            { time: "2-4s", visual: "Pouring a small drop of water on fabric; absorbs and diffuses instantly in seconds.", voice_over: "Keringat cepat terserap tuntas bebas lembap seharian!" },
            { time: "4-6s", visual: "Folding compactly in hand; springs open cleanly without creasing.", voice_over: "Elastisitas empat arahnya beneran lentur ngikutin gerak!" },
            { time: "6-8s", visual: "Comparing waistband thickness with ordinary loose competitor waistband.", voice_over: "Beda kelas jauh dibanding kolor pasaran yang gampang kendor!" },
            { time: "8-10s", visual: "Creator nods in genuine satisfaction feeling the soft texture.", voice_over: "Kualitasnya beneran premium luar biasa nyaman rek!" }
          ],
          p3: [
            { time: "0-2s", visual: `Creator holding multi-pack box containing neat 3-pack color variants.`, voice_over: "Sekali beli langsung dapat paket hemat lengkap!" },
            { time: "2-4s", visual: "Displaying navy, dark grey, and black colorways neatly lined up.", voice_over: "Semua varian warnanya maskulin dan sangat berkelas!" },
            { time: "4-6s", visual: "Quick wash demonstration in basin; fabric dries ultra fast.", voice_over: "Dicuci berkali-kali warnanya nggak luntur tetap awet!" },
            { time: "6-8s", visual: "Showing official hygiene zip-lock packaging pouch.", voice_over: "Harga promo bundling lagi murah banget jangan lewatkan!" },
            { time: "8-10s", visual: "Creator gives energetic nod and closing thumbs-up (clean frame).", voice_over: "Buruan amankan ukuranmu sekarang sebelum stok promo ludes!" }
          ],
          cta: "Buruan amankan ukuranmu sekarang sebelum stok promo ludes!"
        },
        {
          title: `P1 — UJI SIKAT KASAR & GOSOK EKSTREM CELANA DALAM`,
          concept: `Violent brush scratch test proving zero thread fuzzing on ice silk boxer.`,
          p1: [
            { time: "0-2s", visual: `AGGRESSIVE BRUSH HOOK. Creator takes laundry brush and aggressively scrubs the fabric surface of ${productName} on table.`, voice_over: "Banyak yang ragu, langsung tak sikat kasar!" },
            { time: "2-4s", visual: "Camera zooms in macro on the brushed spot; zero pilling, zero pulled threads.", voice_over: "Digesek sikat kencang seratnya tetap halus rapat!" },
            { time: "4-6s", visual: "Stretching the thigh opening wide with both hands with maximum force.", voice_over: "Pahanya lentur bebas gerak nggak bakal bikin lecet!" },
            { time: "6-8s", visual: "Blowing cigarette smoke or steam through fabric; passes through instantly.", voice_over: "Sirkulasi udaranya terbukti tembus bikin area sejuk!" },
            { time: "8-10s", visual: "Lifting the boxer into natural room light, completely pristine.", voice_over: "Yuk cek kerapian jahitannya secara detail sekarang!" }
          ],
          p2: [
            { time: "0-2s", visual: `Detailed inspection of the 3D ergonomic pouch and smooth waistband.`, voice_over: "Desain U-pouch pas menopang dengan sangat nyaman!" },
            { time: "2-4s", visual: "Feeling the featherlight weight in hands, weighing under 50 grams.", voice_over: "Ringan pol rek, berasa kayak nggak pakai apa-apa!" },
            { time: "4-6s", visual: "Testing recovery after squeezing into tight ball; zero wrinkles.", voice_over: "Bahan modal spandex anti kusut langsung balik rapi!" },
            { time: "6-8s", visual: "Touching the silky cool-touch surface that dissipates heat.", voice_over: "Sensasi dingin sejuknya bikin betah seharian penuh!" },
            { time: "8-10s", visual: "Creator nods in total agreement with customer praise.", voice_over: "Pantas aja ribuan pria borong produk ini terus!" }
          ],
          p3: [
            { time: "0-2s", visual: `Creator holding boxed package containing 4 pairs on display table.`, voice_over: "Keputusan terbaik ganti celana dalam lama kalian!" },
            { time: "2-4s", visual: "Showing size chart L, XL, XXL clearly labeled on packaging back.", voice_over: "Pilihan ukurannya lengkap dari standar sampai jumbo!" },
            { time: "4-6s", visual: "Neat stack of fresh boxers ready for daily drawer organization.", voice_over: "Awet bertahun-tahun karetnya nggak bakal cepat molor!" },
            { time: "6-8s", visual: "Showing flash sale badge on packing slip (footage clean).", voice_over: "Mumpung lagi ada voucher diskon ongkir toko!" },
            { time: "8-10s", visual: "Closing thumbs-up urge to checkout immediately (zero text).", voice_over: "Segera checkout sekarang mumpung voucher diskonnya aktif!" }
          ],
          cta: "Segera checkout sekarang mumpung voucher diskonnya aktif!"
        }
      ];
    } else if (productType === "Celana Dalam Wanita") {
      activePool = [
        {
          title: `P1 — UJI SEAMLESS INVISIBLE & TARIK MAKSIMAL`,
          concept: `Extreme stretch test of women's seamless panties proving zero panty-line visibility.`,
          p1: [
            { time: "0-2s", visual: `SEAMLESS STRETCH HOOK. Two female hands pull the seamless edge of ${productName} wide against bright daylight. Extreme flexibility.`, voice_over: "Kaget pol rek, lenturnya beneran sehalus kulit!" },
            { time: "2-4s", visual: "Releasing immediately; edge snaps back perfectly flat with zero curling or wave.", voice_over: "Pinggirannya seamless tanpa jahitan nggak bakal nyeplak!" },
            { time: "4-6s", visual: "Showing panty worn under tight white leggings; zero outline or visible line visible.", voice_over: "Pakai celana ketat pun garisnya beneran hilang tuntas!" },
            { time: "6-8s", visual: "Rubbing the 100% cotton antibacterial crotch lining with clean fingertips.", voice_over: "Lapisan katun dalamnya higienis anti gatal dan bakteri!" },
            { time: "8-10s", visual: "Holding panty up in natural light; ultra thin, sheer, and featherlight.", voice_over: "Biar makin yakin, yuk kita buktikan kenyamanannya!" }
          ],
          p2: [
            { time: "0-2s", visual: `Hands scrunch the ice-silk fabric into tight fist, then release; zero creases.`, voice_over: "Bahannya sejuk adem nggak bikin gerah atau lembap!" },
            { time: "2-4s", visual: "Testing gentle waistband against wrist; leaves zero red compression marks.", voice_over: "Karet pinggangnya lembut nggak mencekik atau berbekas merah!" },
            { time: "4-6s", visual: "Close-up macro of laser-cut ultrasonic edge finish; perfectly smooth.", voice_over: "Finishing laser cut rapi tanpa sisa benang kasar!" },
            { time: "6-8s", visual: "Quick splash of clean water on cotton gusset; absorbs instantly.", voice_over: "Daya serapnya cepat menjaga area kewanitaan tetap kering!" },
            { time: "8-10s", visual: "Creator looks genuinely amazed at the invisible second-skin feel.", voice_over: "Beneran berasa kayak kulit kedua saking enaknya rek!" }
          ],
          p3: [
            { time: "0-2s", visual: `Creator holding aesthetic pastel pack containing 5 panties on dressing table.`, voice_over: "Ini sih wajib punya semua wanita di rumah!" },
            { time: "2-4s", visual: "Showing nude, dusty pink, soft cream, and black pastel tones.", voice_over: "Pilihan warna nude estetik gampang dipadukan busana luar!" },
            { time: "4-6s", visual: "Showing individual hygiene pouch packaging for each panty.", voice_over: "Kemasan higienis terawat sangat aman sampai tujuan!" },
            { time: "6-8s", visual: "Creator points down with urgent friendly affiliate nod.", voice_over: "Harga bundlingnya murah banget mumpung ada promo diskon!" },
            { time: "8-10s", visual: "Urgent call-to-action gesture pointing down cleanly.", voice_over: "Pesan sekarang juga mumpung kuota promonya masih dibuka!" }
          ],
          cta: "Pesan sekarang juga mumpung kuota promonya masih dibuka!"
        }
      ];
    } else if (productType === "Bantal") {
      activePool = [
        {
          title: `P1 — UJI TIMPA BEBAN BERAT & REBOUND BANTAL`,
          concept: `Crushing pillow under heavy weight, then instant fluffy rebound test.`,
          p1: [
            { time: "0-2s", visual: `CRUSH TEST HOOK. Handheld camera captures heavy gallon of water slammed directly onto ${productName}.`, voice_over: "Jangan kaget rek, bantal viral ini tak tindih!" },
            { time: "2-4s", visual: "Gallon is pushed deep compressing pillow completely flat.", voice_over: "Ditekan beban seberat ini apakah bakalan kempes penyok?" },
            { time: "4-6s", visual: "Gallon is suddenly lifted off; pillow explodes back into full fluffy volume instantly.", voice_over: "Seketika langsung ngembang balik empuk tebal seketika!" },
            { time: "6-8s", visual: "Two hands punch pillow firmly from sides; microfibers puff back smoothly.", voice_over: "Serat silikon mikrofiber grade A beneran anti-kempes pol!" },
            { time: "8-10s", visual: "Unzipping side to inspect pristine pure white virgin silicone fiber inside.", voice_over: "Lihat isi serat silikonnya putih bersih tanpa oplosan!" }
          ],
          p2: [
            { time: "0-2s", visual: `Resting head and neck onto pillow; ergonomic contour hugs spine perfectly.`, voice_over: "Pas ditiduri langsung nopang leher bebas kaku pegal!" },
            { time: "2-4s", visual: "Smooth breathable polymicro cotton cover feeling soft against skin.", voice_over: "Kain covernya adem bersirkulasi tinggi bebas rasa gerah!" },
            { time: "4-6s", visual: "Double piping stitches along edges shown under room light.", voice_over: "Jahitan ganda rapi kuat nggak bakal sobek atau bocor!" },
            { time: "6-8s", visual: "Shaking pillow vigorously; fibers redistribute evenly without clumping.", voice_over: "Nggak gampang menggumpal meskipun dipakai tidur bertahun-tahun!" },
            { time: "8-10s", visual: "Creator smiles relaxed with head on pillow enjoying hotel luxury.", voice_over: "Tidur malam jadi nyenyak serasa di hotel mewah!" }
          ],
          p3: [
            { time: "0-2s", visual: `Creator holding pair of pillows on modern bed under warm bedroom lighting.`, voice_over: "Investasi tidur nyenyak yang beneran worth it rek!" },
            { time: "2-4s", visual: "Showing large vacuum-sealed packaging before opening on bed.", voice_over: "Kemasan vakum tebal aman anti kotor saat pengiriman!" },
            { time: "4-6s", visual: "Standard hotel size 45x65 cm fitting regular pillowcases effortlessly.", voice_over: "Ukurannya standar hotel pas buat semua sarung bantal!" },
            { time: "6-8s", visual: "Holding product package showcasing discounted 2-in-1 bundling price.", voice_over: "Mumpung lagi ada promo paket hemat sepasang bantal!" },
            { time: "8-10s", visual: "Closing thumbs-up gesture urging viewers to order now.", voice_over: "Buruan checkout sekarang sebelum kuota promonya habis ya!" }
          ],
          cta: "Buruan checkout sekarang sebelum kuota promonya habis ya!"
        }
      ];
    } else {
      // Default stress test (sandal/footwear or general durable items)
      activePool = [
        {
          title: `P1 — UJI SIKSA EKSTREM 360 DERAJAT ${productType.toUpperCase()}`,
          concept: `Violent twisting 360 degrees and aggressive ground slamming of ${productName}.`,
          p1: [
            { time: "0-2s", visual: `SHOCKING TORTURE HOOK. Two hands violently twist the ${productType.toLowerCase()} 360 degrees like a towel under clear daylight.`, voice_over: "Jangan kaget rek, ini sengaja tak siksa habis-habisan!" },
            { time: "2-4s", visual: "Stepping on the product with full adult body weight on hard concrete ground.", voice_over: "Diinjak sekuat tenaga pun bentuknya nggak bakal penyok!" },
            { time: "4-6s", visual: "Pouring muddy dirty water all over the surface with splashing sound.", voice_over: "Disiram air kotor nodanya langsung meluncur jatuh bersih!" },
            { time: "6-8s", visual: "Violently flexing the material back and forth rapidly without mercy.", voice_over: "Elastisitas bahannya beneran gila kuat tahan banting pol!" },
            { time: "8-10s", visual: "Holding product steady in front of camera lens, completely unharmed.", voice_over: "Lihat kondisi fisiknya setelah disiksa secara brutal begini!" }
          ],
          p2: [
            { time: "0-2s", visual: `Macro inspection along seams, joints, and surface of ${productType}. Zero creases.`, voice_over: "Kondisinya tetap mulus seratus persen tanpa retak sedikitpun!" },
            { time: "2-4s", visual: "Stretching and feeling original bounce and softness restored instantly.", voice_over: "Bentuk aslinya langsung balik kayak barang baru rek!" },
            { time: "4-6s", visual: "Testing functional grip and stability under vigorous lateral movement.", voice_over: "Performanya tetap stabil dan sangat nyaman dipakai melangkah!" },
            { time: "6-8s", visual: "Single wet wipe cleans off any remaining mud; spotless like new.", voice_over: "Dicuci berkali-kali warnanya nggak bakalan pudar atau luntur!" },
            { time: "8-10s", visual: "Creator looks genuinely amazed by resilience with an authentic nod.", voice_over: "Terbukti awet bertahun-tahun nggak bakal nyesel beli ini!" }
          ],
          p3: [
            { time: "0-2s", visual: `Creator holding product next to packaging, smiling in total victory.`, voice_over: "Udah lulus tes ekstrem dan kualitasnya terbukti nyata!" },
            { time: "2-4s", visual: "Showing neat factory packaging and warranty slip in creator's room.", voice_over: "Pengiriman cepat dan bergaransi resmi toko sangat aman!" },
            { time: "4-6s", visual: "Demonstrating sleek aesthetic look during regular casual wear.", voice_over: "Pilihan warnanya keren cocok dipakai siapa saja harian!" },
            { time: "6-8s", visual: "Showing package ready for dispatch with discount badge highlighted.", voice_over: "Harganya promo murah banget tapi mutunya beneran sultan!" },
            { time: "8-10s", visual: "Creator points down firmly with confident smile (clean footage).", voice_over: "Pesan sekarang juga mumpung diskonnya masih berlaku ya!" }
          ],
          cta: "Pesan sekarang juga mumpung diskonnya masih berlaku ya!"
        }
      ];
    }
  }

  // =========================================================================
  // 2. CONCEPT: UNBOXING VIRAL (Logically scaled packaging)
  // =========================================================================
  else if (conceptId === "unboxing_viral") {
    if (productType === "Bantal") {
      activePool = [
        {
          title: `P1 — BUKA PLASTIK VAKUM KEMASAN BESAR BANTAL`,
          concept: `Cutting large vacuum-sealed bag and watching pillow instantly expand huge on table.`,
          p1: [
            { time: "0-2s", visual: `VACUUM EXPANSION HOOK. Handheld camera rushes to a large vacuum-compressed package on table. Scissors snip plastic, air rushes in with loud whoosh.`, voice_over: "Akhirnya paket bantal viral hotel mendarat juga!" },
            { time: "2-4s", visual: `Pillow dramatically inflates and expands 3x thicker into a huge fluffy cloud filling the frame.`, voice_over: "Kaget pol begitu digunting langsung mekar tebal!" },
            { time: "4-6s", visual: "Creator gasps and pats the pillow with both hands, feeling the luxurious bouncy fluffiness.", voice_over: "Bahan fisiknya padat empuk beneran sekelas hotel bintang lima!" },
            { time: "6-8s", visual: "Inspecting the neat double-stitch piping around edges under room lights.", voice_over: "Nggak nyangka harga segini dapat kualitas semewah ini!" },
            { time: "8-10s", visual: "Immediate head-rest test on bed with blissful resting smile.", voice_over: "Langsung aja kita cobain sensasi empuknya yuk!" }
          ],
          p2: [
            { time: "0-2s", visual: `Creator lays head back onto pillow; contours gently support neck and head.`, voice_over: "Pas ditiduri langsung nopang leher tanpa rasa pegal!" },
            { time: "2-4s", visual: "Comparing side-by-side with flat, lumpy old pillow showing huge difference.", voice_over: "Beda kelas jauh dibanding bantal kempes murahan rek!" },
            { time: "4-6s", visual: "Smooth cotton polymicro cover feels cool and soft to touch.", voice_over: "Kain adem bersirkulasi tinggi bikin tidur bebas gerah!" },
            { time: "6-8s", visual: "Pressing deep with fists; springs right back without indentation.", voice_over: "Serat silikon mikrofiber kualitas prima anti-kempes tahan lama!" },
            { time: "8-10s", visual: "Creator nods in total agreement with viral reviews.", voice_over: "Pantas aja ribuan ulasan bintang lima semua!" }
          ],
          p3: [
            { time: "0-2s", visual: `Creator sitting on bed holding pair of fresh pillows, completely satisfied.`, voice_over: "Keputusan terbaik belanja bantal buat tidur nyenyak!" },
            { time: "2-4s", visual: "Showing neat large courier packaging and invoice on nightstand.", voice_over: "Stoknya makin menipis karena banyak yang borong paket sepasang!" },
            { time: "4-6s", visual: "Side zipper inspection showing clean pure white fiber fill.", voice_over: "Awet tahan lama bisa dicuci tanpa bikin menggumpal!" },
            { time: "6-8s", visual: "Creator raises excited thumbs-up with warm recommendation.", voice_over: "Mumpung voucher diskon gratis ongkirnya masih aktif sekarang!" },
            { time: "8-10s", visual: "Urgent closing gesture urging viewers to checkout immediately.", voice_over: "Langsung checkout sekarang sebelum kehabisan voucher diskonnya!" }
          ],
          cta: "Langsung checkout sekarang sebelum kehabisan voucher diskonnya!"
        }
      ];
    } else if (productType === "Celana Dalam Pria" || productType === "Celana Dalam Wanita") {
      activePool = [
        {
          title: `P1 — BUKA HARDBOX KEMASAN EKSKLUSIF PAKET HIGIENIS`,
          concept: `Unboxing sleek compact hygiene ziplock package revealing premium underwear set.`,
          p1: [
            { time: "0-2s", visual: `SLEEK UNBOXING HOOK. Handheld camera captures creator sliding open a sleek matte packaging box containing individual hygiene ziplock pouches of ${productName}.`, voice_over: "Kaget pol pas buka dus kemasan aslinya rek!" },
            { time: "2-4s", visual: "Taking out one unit sealed in sterile pouch; unzipping to feel the ice-silk fabric.", voice_over: "Packingannya beneran niat rapi mirip brand mall mewah!" },
            { time: "4-6s", visual: "Lifting the fabric into daylight showing seamless finish and airy breathability.", voice_over: "Warnanya keluar banget dan bahannya sejuk halus pol!" },
            { time: "6-8s", visual: "Stretching elastic gently between fingers with zero seam friction.", voice_over: "Cetakan fisiknya presisi tanpa ada cacat jahitan kasar!" },
            { time: "8-10s", visual: "Delighted reaction as creator realizes how featherlight and soft it is.", voice_over: "Biar gak makin penasaran, yuk kita buktikan performanya!" }
          ],
          p2: [
            { time: "0-2s", visual: `Demonstrating 4-way elastic stretch and instant recovery without wrinkles.`, voice_over: "Performanya bekerja mulus tanpa rasa sesak sama sekali!" },
            { time: "2-4s", visual: "Close-up showing flatlock smooth seams and cotton hygiene gusset.", voice_over: "Pas dipakai langsung pas nggak bikin gerah atau gatal!" },
            { time: "4-6s", visual: "Blowing through fabric or droplet test showing instant moisture wicking.", voice_over: "Menyerap keringat seketika menjaga area tetap kering sejuk!" },
            { time: "6-8s", visual: "Comparing side-by-side with coarse ordinary competitor underwear.", voice_over: "Beda kelas jauh dibanding kolor pasaran yang gerah!" },
            { time: "8-10s", visual: "Nodding in sincere appreciation of the craftsmanship.", voice_over: "Serius ini kualitasnya jauh di atas harganya rek!" }
          ],
          p3: [
            { time: "0-2s", visual: `Creator holding full 3-pack or 4-pack set proudly on display table.`, voice_over: "Beneran nyesel cuma beli satu kotak kemarin!" },
            { time: "2-4s", visual: "Showing multiple color variants side by side for comparison.", voice_over: "Semua varian warnanya estetik cocok dipakai ganti harian!" },
            { time: "4-6s", visual: "Showing neat wardrobe drawer organization with rolled units.", voice_over: "Bahan awet dicuci berkali-kali nggak melar kendor!" },
            { time: "6-8s", visual: "Holding product packaging with genuine recommendation smile.", voice_over: "Mumpung lagi ada promo bundling spesial toko!" },
            { time: "8-10s", visual: "Creator gives warm closing gesture to secure order immediately.", voice_over: "Amankan punya kalian sekarang sebelum harga normal berlaku!" }
          ],
          cta: "Amankan punya kalian sekarang sebelum harga normal berlaku!"
        }
      ];
    } else {
      activePool = [
        {
          title: `P1 — UNBOXING PAKET VIRAL ${productType.toUpperCase()}`,
          concept: `Rushing to rip open packaging tape on delivery parcel of ${productName}.`,
          p1: [
            { time: "0-2s", visual: `FAST UNBOXING HOOK. Handheld camera rushes towards cardboard package on table. Creator rips open tape with breathless excitement.`, voice_over: "Akhirnya paket viral se-Indonesia ini mendarat juga!" },
            { time: "2-4s", visual: `Revealing the pristine ${productType.toLowerCase()} inside wrapping. Eyes widen in authentic shock.`, voice_over: "Kaget pol rek, aslinya jauh lebih mewah!" },
            { time: "4-6s", visual: "Taking product out under bright lighting, showing rich colors and sleek textures.", voice_over: "Bahan fisiknya kerasa tebal dan sangat berkelas pol!" },
            { time: "6-8s", visual: "Holding product up close to lens, highlighting premium finishing details.", voice_over: "Nggak nyangka harga segini dapat barang sebagus ini!" },
            { time: "8-10s", visual: "Immediate first try-on or test on the spot with a stunned smile.", voice_over: "Langsung aja kita cobain kehebatan aslinya yuk!" }
          ],
          p2: [
            { time: "0-2s", visual: `Hands putting the ${productType.toLowerCase()} to immediate real-world use with seamless flow.`, voice_over: "Pas dicoba beneran sesuai sama klaim viralnya rek!" },
            { time: "2-4s", visual: "Comparing side-by-side with an ordinary cheap version showing vast difference in quality.", voice_over: "Beda level banget dibanding barang abal-abal murahan!" },
            { time: "4-6s", visual: "Close-up on unique feature functioning perfectly.", voice_over: "Fitur unggulannya ini yang bikin semua orang suka!" },
            { time: "6-8s", visual: "Moving around comfortably enjoying the effortless utility.", voice_over: "Dipakai seharian beneran bikin nyaman tanpa rasa pegal!" },
            { time: "8-10s", visual: "Creator nods in total agreement with the viral hype.", voice_over: "Pantas aja ribuan ulasan bintang lima semua rek!" }
          ],
          p3: [
            { time: "0-2s", visual: `Creator holding product next to phone showing checkout confirmation, completely satisfied.`, voice_over: "Keputusan terbaik tahun ini belanja produk ini rek!" },
            { time: "2-4s", visual: "Showing neat packaged sets ready to be ordered, colors well organized.", voice_over: "Stoknya makin menipis karena banyak orang yang borong!" },
            { time: "4-6s", visual: "Camera showcases the durability and easy maintenance.", voice_over: "Awet tahan lama nggak bakal gampang rusak patah!" },
            { time: "6-8s", visual: "Creator raises an excited thumbs-up towards the product.", voice_over: "Mumpung voucher gratis ongkirnya masih aktif sekarang ini!" },
            { time: "8-10s", visual: "Energetic closing gesture urging viewer to secure theirs immediately.", voice_over: "Langsung checkout sekarang sebelum kehabisan voucher diskonnya!" }
          ],
          cta: "Langsung checkout sekarang sebelum kehabisan voucher diskonnya!"
        }
      ];
    }
  }

  // =========================================================================
  // 3. CONCEPT: PROBLEM-SOLUTION (Authentic logical daily drama)
  // =========================================================================
  else if (conceptId === "problem_solution") {
    if (productType === "Celana Dalam Wanita") {
      activePool = [
        {
          title: `P1 — MALU GARIS CELANA DALAM NYEPLAK & SOLUSI SEAMLESS`,
          concept: `Relatable frustration of visible panty lines through fitted pants, solved by seamless invisible underwear.`,
          p1: [
            { time: "0-2s", visual: `FRUSTRATION MIRROR HOOK. A woman in fitted trousers turns to mirror in dismay, showing embarrassing bumpy panty lines and pinching waistband.`, voice_over: "Malu pol rek, kemarin garis celana nyeplak!" },
            { time: "2-4s", visual: "Close-up of red compression marks on skin from tight ordinary stitched rubber.", voice_over: "Mana karetnya bikin gatal berbekas merah di pinggang!" },
            { time: "4-6s", visual: `Hands reveal the savior: smooth seamless ice-silk ${productName} with zero edge seams.`, voice_over: "Untung langsung beralih ke celana dalam seamless ini!" },
            { time: "6-8s", visual: "Showing ultra-thin laser-cut edge and antibacterial cotton crotch lining.", voice_over: "Potongan laser cut halus nggak nyeplak dan higienis!" },
            { time: "8-10s", visual: "Immediate transition showing smooth, silhouette-free fit under fitted trousers.", voice_over: "Lihat bedanya pas dipakai celana ketat langsung rapi!" }
          ],
          p2: [
            { time: "0-2s", visual: `Rear and side profile check in mirror; pants fall completely smooth with zero lines.`, voice_over: "Garis nyeplaknya hilang tuntas terlihat mulus sempurna rek!" },
            { time: "2-4s", visual: "Moving, sitting, and walking naturally; waistband stays in place without rolling down.", voice_over: "Nggak bakal menggulung dan sangat pas di pinggul!" },
            { time: "4-6s", visual: "Close-up on cotton inner crotch keeping intimate area fresh and dry.", voice_over: "Serat katun antibakteri menjaga kebersihan bebas lembap gerah!" },
            { time: "6-8s", visual: "Lightweight stretch moves with body like a second skin.", voice_over: "Enteng adem kayak nggak berasa pakai apa-apa!" },
            { time: "8-10s", visual: "Delighted reaction to camera validating complete confidence boost.", voice_over: "Bikin makin percaya diri pakai baju apapun setiap hari!" }
          ],
          p3: [
            { time: "0-2s", visual: `Creator sitting proudly with multi-color pastel pack on dressing table.`, voice_over: "Penyelamat outfit yang wajib ada di lemari kalian!" },
            { time: "2-4s", visual: "Displaying nude, black, soft grey, and rose quartz colorways.", voice_over: "Pilihan warnanya netral estetik cocok untuk segala outfit!" },
            { time: "4-6s", visual: "Washing by hand; dries quickly within hours without losing elasticity.", voice_over: "Gampang dicuci dan bahannya awet tidak gampang melar!" },
            { time: "6-8s", visual: "Holding packaged set with discount sticker highlighted.", voice_over: "Harga satu paket hemat banget mumpung promo toko!" },
            { time: "8-10s", visual: "Warm closing nod encouraging immediate order.", voice_over: "Buruan checkout paket kalian sekarang sebelum kehabisan promo!" }
          ],
          cta: "Buruan checkout paket kalian sekarang sebelum kehabisan promo!"
        }
      ];
    } else if (productType === "Celana Dalam Pria") {
      activePool = [
        {
          title: `P1 — GERAH LEMBAP SEHARIAN & SOLUSI BOXER ICE SILK`,
          concept: `Frustration of sweating and waistband pinching during active day, solved by breathable modal boxer.`,
          p1: [
            { time: "0-2s", visual: `DISCOMFORT HOOK. Active man sitting uncomfortably shifting in chair, constantly adjusting pinched waistband under hot tropical weather.`, voice_over: "Gerah dan sesak pol kalau salah pilih kolor!" },
            { time: "2-4s", visual: "Close-up on tangled twisted waistband and sweaty rough cotton fabric.", voice_over: "Karetnya melintir bikin pinggang gatal nggak nyaman seharian!" },
            { time: "4-6s", visual: `Revealing the savior: breathable 4-way stretch ice-silk modal ${productName}.`, voice_over: "Untung sekarang nemu boxer penyelamat paling adem ini!" },
            { time: "6-8s", visual: "Showing wide flat elastic waistband that never rolls, and U-pouch contour.", voice_over: "Karet pinggang elastis tebal anti-melintir bebas gerak leluasa!" },
            { time: "8-10s", visual: "Stretching fabric in hands; cool breeze passes through instantly.", voice_over: "Lihat elastisitas dan sensasi sejuknya waktu dipegang!" }
          ],
          p2: [
            { time: "0-2s", visual: `Walking and moving actively in office or sports; boxer stays perfectly in position.`, voice_over: "Dipakai aktivitas seharian tetap sejuk bebas gerah rek!" },
            { time: "2-4s", visual: "U-pouch provides ergonomic supportive fit without pinching or rubbing inner thighs.", voice_over: "Topangannya pas nggak bikin selangkangan lecet atau gatal!" },
            { time: "4-6s", visual: "Water droplet diffusion test demonstrating instant sweat evaporation.", voice_over: "Menyerap keringat super cepat bikin area selalu kering!" },
            { time: "6-8s", visual: "Smooth flatlock stitching leaves zero imprint on outer pants.", voice_over: "Nggak nyeplak dan jahitannya kuat tahan lama pol!" },
            { time: "8-10s", visual: "Creator nods in total validation of comfortable daily wear.", voice_over: "Beneran nyesel kenapa nggak dari dulu pakai ini!" }
          ],
          p3: [
            { time: "0-2s", visual: `Creator holding neat box of 4 boxers ready for daily drawer organization.`, voice_over: "Wajib punya buat pria yang aktif beraktivitas harian!" },
            { time: "2-4s", visual: "Showing classic masculine colors (navy, charcoal, black, light grey).", voice_over: "Warnanya maskulin elegan dan nggak gampang luntur dicuci!" },
            { time: "4-6s", visual: "Inspecting intact waistband after washing; zero curls or sagging.", voice_over: "Karetnya teruji awet bertahun-tahun tetap kencang presisi!" },
            { time: "6-8s", visual: "Showing delivery box with verified shop guarantee.", voice_over: "Mumpung ada voucher diskon ongkir hemat besar-besaran!" },
            { time: "8-10s", visual: "Urgent pointing gesture to secure sizes immediately.", voice_over: "Segera amankan ukuran kalian sekarang sebelum stoknya ludes!" }
          ],
          cta: "Segera amankan ukuran kalian sekarang sebelum stoknya ludes!"
        }
      ];
    } else if (productType === "Bantal") {
      activePool = [
        {
          title: `P1 — LEHER KAKU TENGENGEN & SOLUSI BANTAL SILIKON`,
          concept: `Waking up rubbing stiff painful neck from flat pillow, saved by hotel-grade ergonomic pillow.`,
          p1: [
            { time: "0-2s", visual: `NECK STIFFNESS HOOK. Creator wakes up holding neck in grimacing pain, trying to rotate stiff head after sleeping on a flat lumpy pillow.`, voice_over: "Kapok rek, bangun tidur leher kaku tengengen!" },
            { time: "2-4s", visual: "Tossing the flat hard pillow aside onto floor in sheer annoyance.", voice_over: "Bantal lama udah kempes bikin kepala sering pusing!" },
            { time: "4-6s", visual: `Unveiling the fluffy, high-resilience ${productName} with deep microfiber support.`, voice_over: "Untung langsung ganti pakai bantal silikon hotel ini!" },
            { time: "6-8s", visual: "Pressing head down into center; pillow cradles cervical spine at ideal ergonomic angle.", voice_over: "Tingginya pas menopang leher dan kepala tanpa pegal!" },
            { time: "8-10s", visual: "Resting head back down; eyes close in relaxed blissful comfort.", voice_over: "Lihat empuknya langsung bikin rileks seketika rek!" }
          ],
          p2: [
            { time: "0-2s", visual: `Peaceful sleeping posture on pillow; spine and neck align straight and stress-free.`, voice_over: "Bangun pagi badan segar tanpa ada rasa pegal!" },
            { time: "2-4s", visual: "Demonstrating high-elastic rebound when pressing hand deep into center.", voice_over: "Membal empuk seketika nggak bakal gampang kempes kempos!" },
            { time: "4-6s", visual: "Close-up of soft breathable cotton cover dissipating head heat.", voice_over: "Kain adem bikin tidur nyenyak bebas keringat malam!" },
            { time: "6-8s", visual: "Fluffing pillow in two easy pats; retains full cloud-like volume.", voice_over: "Tepuk sedikit langsung mengembang lagi seperti baru terus!" },
            { time: "8-10s", visual: "Creator sits up smiling brightly feeling fully energized.", voice_over: "Tidur malam jadi berkualitas serasa di kamar hotel!" }
          ],
          p3: [
            { time: "0-2s", visual: `Creator sitting on bed holding two pillows ready for bedroom upgrade.`, voice_over: "Investasi kesehatan tidur yang wajib kalian punya sekarang!" },
            { time: "2-4s", visual: "Showing neat packaged vacuum parcel with verified store seal.", voice_over: "Packing aman bergaransi resmi toko sampai ke rumah!" },
            { time: "4-6s", visual: "Fitting regular pillowcases easily with neat 45x65 cm dimensions.", voice_over: "Bahan higienis aman buat pernapasan bebas debu alergi!" },
            { time: "6-8s", visual: "Holding product up with sincere caring smile.", voice_over: "Harganya terjangkau pol mumpung paket hematnya masih ada!" },
            { time: "8-10s", visual: "Closing thumbs up urge to checkout immediately.", voice_over: "Langsung checkout sekarang sebelum kehabisan voucher promonya ya!" }
          ],
          cta: "Langsung checkout sekarang sebelum kehabisan voucher promonya ya!"
        }
      ];
    } else {
      // General problem solution (slippery floors for footwear, etc.)
      activePool = [
        {
          title: `P1 — MASALAH NYATA & PENYELAMAT INSTAN ${productType.toUpperCase()}`,
          concept: `Relatable frustration hook followed by the revelation of ${productName} as the savior.`,
          p1: [
            { time: "0-2s", visual: `EMOTIONAL HOOK. Camera captures creator dealing with frustrating daily fatigue or discomfort caused by poor equipment.`, voice_over: "Kapok rek, kemarin sempat ngerasain kesiksa begini!" },
            { time: "2-4s", visual: "Close-up on tired expression and annoying ache caused by substandard items.", voice_over: "Sering banget capek ngadepin masalah yang sama terus!" },
            { time: "4-6s", visual: `Hands reveal the solution: unveiling the ergonomic ${productType.toLowerCase()} ready to solve everything.`, voice_over: "Untung sekarang udah nemu penyelamat terbaik satu ini!" },
            { time: "6-8s", visual: "Showing high-grade materials and scientific contour designed for relief.", voice_over: "Desainnya dibuat khusus buat atasi keluhan kalian sehari-hari!" },
            { time: "8-10s", visual: "Immediate transition as the product is applied or used.", voice_over: "Lihat bedanya pas barang ini langsung tak pakai!" }
          ],
          p2: [
            { time: "0-2s", visual: `INSTANT RELIEF TRANSFORMATION. The moment ${productType} is in action, all stress vanishes.`, voice_over: "Seketika langsung kerasa nyaman dan adem pol rek!" },
            { time: "2-4s", visual: "Demonstrating how smooth, easy, and painless the experience is now.", voice_over: "Nggak ada lagi drama ribet pegal atau capek!" },
            { time: "4-6s", visual: "Close-up on physical details providing superior support and alignment.", voice_over: "Bantalannya empuk topang aktivitas harian dengan sangat sempurna!" },
            { time: "6-8s", visual: "Happy, relaxed posture enjoying the solved problem completely.", voice_over: "Aktivitas jadi makin produktif tanpa ada gangguan sama sekali!" },
            { time: "8-10s", visual: "Creator breathes a sigh of relief with a radiant smile.", voice_over: "Beneran nyesel kenapa baru tahu dan beli sekarang!" }
          ],
          p3: [
            { time: "0-2s", visual: `Creator holding ${productType} in front of camera with heartfelt enthusiasm.`, voice_over: "Solusi wajib punya buat setiap orang di rumah rek!" },
            { time: "2-4s", visual: "Showing multiple color variants and packaged units ready to ship.", voice_over: "Investasi kenyamanan harian yang beneran sangat berharga sekali!" },
            { time: "4-6s", visual: "Demonstrating quick cleaning and durable resilience.", voice_over: "Barangnya awet tahan lama nggak gampang rusak kempes!" },
            { time: "6-8s", visual: "Holding product proudly with a warm recommendation.", voice_over: "Harga terjangkau mumpung kuota promonya masih dibuka toko!" },
            { time: "8-10s", visual: "Confident closing gesture with encouraging smile (clean frame).", voice_over: "Amankan produk penyelamat ini sekarang sebelum kehabisan ya!" }
          ],
          cta: "Amankan produk penyelamat ini sekarang sebelum kehabisan ya!"
        }
      ];
    }
  }

  // =========================================================================
  // 4. DEFAULT CONCEPT: SOCIAL PROOF / KERUMUNAN TOKO
  // =========================================================================
  else {
    activePool = [
      {
        title: `P1 — ${productType.toUpperCase()} YANG BIKIN IBU-IBU BERHENTI`,
        concept: `Handheld camera rushes into a crowded store display where mothers suddenly cluster around ${productName}.`,
        p1: [
          { time: "0-2s", visual: `POWERFUL SOCIAL PROOF HOOK. Handheld camera rushes toward a crowded display table. A group of shoppers suddenly stops and gathers around the ${productType.toLowerCase()} collection.`, voice_over: "Gila, baru masuk toko ibu-ibu langsung ngumpul!" },
          { time: "2-4s", visual: "Two shoppers reach out at the same second to grab different color variants with animated hand gestures.", voice_over: "Semuanya pada rebutan megang barang ini rek!" },
          { time: "4-6s", visual: "Close-up on hands feeling the texture, pressing the elastic resilience under authentic store lighting.", voice_over: "Penasaran kan kenapa bisa seramai ini di toko?" },
          { time: "6-8s", visual: "Camera pans across neatly arranged display showing wide color range with hands picking up items.", voice_over: "Ternyata warnanya lengkap dan bahannya empuk pol!" },
          { time: "8-10s", visual: "One customer eagerly tests it out right in the aisle with an approving nod.", voice_over: "Biar nggak penasaran, langsung kita tes kenyamanannya!" }
        ],
        p2: [
          { time: "0-2s", visual: `Close-up hands testing elasticity and material durability of ${productType}. Bends and springs back.`, voice_over: "Lihat kelenturan bahannya, beneran empuk kayak awan!" },
          { time: "2-4s", visual: "Hands-on texture and ergonomics demonstration in natural indoor light.", voice_over: "Dipakai berjam-jam pun tetap nyaman tanpa kendala!" },
          { time: "4-6s", visual: "Macro angle on textured surface and clean finish under natural light.", voice_over: "Tekstur detailnya nyaman banget waktu disentuh langsung!" },
          { time: "6-8s", visual: "Testing functional lightweight comfort effortlessly.", voice_over: "Enteng pol rek, kayak nggak ada beban sama sekali!" },
          { time: "8-10s", visual: "Releasing item from gentle bend; pops right back to original silhouette.", voice_over: "Ditekuk berkali-kali bentuknya tetap balik mulus sempurna!" }
        ],
        p3: [
          { time: "0-2s", visual: `At home, creator displays all color variants and original packaging of ${productType} on table.`, voice_over: "Saking enaknya, aku langsung borong semua varian warna!" },
          { time: "2-4s", visual: `Using the ${productType} casually around the house with total comfort and ease.`, voice_over: "Cocok banget buat dipakai harian di dalam rumah!" },
          { time: "4-6s", visual: "Quick demonstration of clean maintenance; wipes clean effortlessly.", voice_over: "Kotor tinggal dilap langsung bersih seperti baru lagi!" },
          { time: "6-8s", visual: "Showing complete boxed unit, highlighting authentic construction and value.", voice_over: "Harga terjangkau tapi kualitasnya juara tahan lama pol!" },
          { time: "8-10s", visual: "Creator gives a confident thumbs-up with smiling urgency (clean footage, zero text).", voice_over: "Buruan amankan ukuran kalian sekarang sebelum stoknya habis!" }
        ],
        cta: "Buruan amankan ukuran kalian sekarang sebelum stoknya habis!"
      },
      {
        title: `P1 — ANTRIAN KASIR BORONG ${productType.toUpperCase()}`,
        concept: `Camera spots customers holding multiple units of ${productName} directly at the cashier queue.`,
        p1: [
          { time: "0-2s", visual: `HIGH-CURIOSITY HOOK. Handheld camera glides past store cashier. Multiple shoppers are holding several units of ${productType.toLowerCase()} in their baskets.`, voice_over: "Waduh, antrean kasir isinya pada borong barang ini!" },
          { time: "2-4s", visual: "Shopper excitedly turns to show friend the options she secured in her arms.", voice_over: "Sampai ada yang bawa empat warna sekaligus rek!" },
          { time: "4-6s", visual: "Close-up of shopper checking the dense, solid material quality with genuine awe.", voice_over: "Kelihatan jelas material fisiknya sangat tebal dan premium!" },
          { time: "6-8s", visual: "Display shelf behind cashier shows almost empty rack where items were placed.", voice_over: "Rak displaynya sampai hampir ludes diserbu orang!" },
          { time: "8-10s", visual: "Camera zooms onto the remaining unit on display shelf ready to be inspected.", voice_over: "Untung masih kebagian, langsung tak buktiin kelebihannya!" }
        ],
        p2: [
          { time: "0-2s", visual: `Immediate hands-on demonstration of ${productType} build quality in natural lighting.`, voice_over: "Finishing barangnya rapi banget tanpa ada cacat fisik!" },
          { time: "2-4s", visual: "Pressing thumb into cushioning; rebounds instantaneously with high bounce.", voice_over: "Ditekan jempol membal empuk nggak bakal gampang kempes!" },
          { time: "4-6s", visual: "Testing functional utility and balance comfortably.", voice_over: "Daya tahannya kuat bikin aktivitas makin aman nyaman!" },
          { time: "6-8s", visual: "Shopper smiles with satisfaction experiencing the lightweight design.", voice_over: "Nyaman dipakai berjam-jam tanpa bikin capek atau pegal!" },
          { time: "8-10s", visual: "Holding item firmly showing flawless seam and structure.", voice_over: "Kualitas bintang lima beneran sepadan sama ramenya!" }
        ],
        p3: [
          { time: "0-2s", visual: `Creator in living room unpacking fresh units of ${productType} side by side.`, voice_over: "Nggak heran kalau di kasir orang pada berebut!" },
          { time: "2-4s", visual: "Trying it out in different home spots showing versatile aesthetic.", voice_over: "Dipakai santai atau kerja di rumah tetap estetik!" },
          { time: "4-6s", visual: "Quick demonstration of clean maintenance and durability.", voice_over: "Bahan praktis dibersihkan dalam hitungan detik saja!" },
          { time: "6-8s", visual: "Showing neat packaged parcel ready for immediate order.", voice_over: "Mumpung voucher gratis ongkirnya masih aktif hari ini!" },
          { time: "8-10s", visual: "Delighted nod and confident pointing gesture toward product.", voice_over: "Pesan sekarang juga sebelum promo hematnya berakhir ya!" }
        ],
        cta: "Pesan sekarang juga sebelum promo hematnya berakhir ya!"
      }
    ];
  }

  // Filter out any variations whose P1 opening hook is in previousHooks (to guarantee novelty!)
  const eligibleVariations = activePool.filter((v) => {
    const openingVO = v.p1[0]?.voice_over || "";
    return !previousHooks.some((prev) => prev.toLowerCase().includes(openingVO.toLowerCase().slice(0, 15)));
  });

  const selectionPool = eligibleVariations.length > 0 ? eligibleVariations : activePool;
  // Use generationAttempt or random to pick a unique variation
  const pickedIndex = (Math.max(0, generationAttempt - 1) + Math.floor(Math.random() * selectionPool.length)) % selectionPool.length;
  const chosenVar = selectionPool[pickedIndex];

  return {
    VIDEO_PROMPT_1: {
      prompt_title: chosenVar.title,
      duration: "10 seconds",
      aspect_ratio: "9:16",
      resolution: "4K Ultra HD",
      product: fullProduct,
      creative_concept: chosenVar.concept,
      visual_style: visualStyle,
      product_reference_priority: {
        rule: "The uploaded product image is the absolute visual authority for the appearance. The product featured in every scene must be 100% identical in silhouette, texture, color, and construction to the uploaded reference photo.",
        preserve: productPreserve,
        colors: colors
      },
      continuity: "Establishes product identity, crowd interest, and visual authority.",
      story: chosenVar.p1,
      scenes: makeScenes(chosenVar.p1),
      voice_identity: voiceIdentity,
      voice_over: voiceIdentity,
      character_behavior: characterBehavior,
      absolute_clean_frame: absoluteCleanFrame,
      hard_fail_conditions: hardFailConditions,
      cta: "TIDAK ADA CTA"
    },
    VIDEO_PROMPT_2: {
      prompt_title: `P2 — BUKTI KUALITAS & KENYAMANAN ${productType.toUpperCase()}`,
      duration: "10 seconds",
      aspect_ratio: "9:16",
      resolution: "4K Ultra HD",
      product: fullProduct,
      creative_concept: `Direct comfort and texture test proving real performance of ${productName} in authentic setting.`,
      visual_style: visualStyle,
      product_reference_priority: {
        rule: "The uploaded product image is the absolute visual authority for the appearance.",
        preserve: productPreserve,
        colors: colors
      },
      continuity: {
        previous_scene: "P1 established crowd interest and initial try-on in store.",
        product_continuity: `Exact same ${productType} in identical colors.`,
        voice_continuity: "Identical 18-year-old female creator."
      },
      story: chosenVar.p2,
      scenes: makeScenes(chosenVar.p2),
      voice_identity: voiceIdentity,
      voice_over: voiceIdentity,
      character_behavior: characterBehavior,
      absolute_clean_frame: absoluteCleanFrame,
      hard_fail_conditions: hardFailConditions,
      cta: "TIDAK ADA CTA"
    },
    VIDEO_PROMPT_3: {
      prompt_title: `P3 — REVIEW DI RUMAH & CLOSING CTA ${productType.toUpperCase()}`,
      duration: "10 seconds",
      aspect_ratio: "9:16",
      resolution: "4K Ultra HD",
      product: fullProduct,
      creative_concept: `Home unboxing, multi-color review, and authentic verbal affiliate CTA for ${productName}.`,
      visual_style: visualStyle,
      product_reference_priority: {
        rule: "The uploaded product image is the absolute visual authority for the appearance.",
        preserve: productPreserve,
        colors: colors
      },
      continuity: {
        previous_scene: "P2 demonstrated texture, grip, and durability test.",
        product_continuity: `Same ${productType}, showing color collection and packaging.`,
        voice_continuity: "Same female creator delivering the closing affiliate push."
      },
      story: chosenVar.p3,
      scenes: makeScenes(chosenVar.p3),
      voice_identity: voiceIdentity,
      voice_over: voiceIdentity,
      character_behavior: characterBehavior,
      absolute_clean_frame: absoluteCleanFrame,
      hard_fail_conditions: hardFailConditions,
      cta: chosenVar.cta
    }
  };
}
