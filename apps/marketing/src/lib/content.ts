export const site = {
  name: "filizlen.io",
  domain: "filizlen.io",
  title: "Anasayfa",
  ogTitle: "filizlen.io — Akıllı tarım",
  slogan: "Akıllı tarım. Güçlü yarınlar.",
  tagline: "Akıllı tarım. Güçlü yarınlar.",
  valueProposition:
    "Veriyi toprağa, değeri hasada dönüştürüyoruz.",
  email: "info@filizlen.io",
  url: "https://filizlen.io",
};

export const brandColors = [
  { name: "Primary Green", hex: "#22C55E", role: "Ana marka rengi" },
  { name: "Dark Green", hex: "#14532D", role: "Metin ve koyu zemin" },
  { name: "Accent Blue", hex: "#38BDF8", role: "Veri ve vurgu" },
  { name: "Light Background", hex: "#F8FAFC", role: "Açık zemin" },
  { name: "Text Gray", hex: "#64748B", role: "İkincil metin" },
];

export const brandPillars = [
  {
    title: "Akıllı Sensörler",
    description: "Tarlanızdaki veriyi anlık izleyin.",
    icon: "sensors" as const,
  },
  {
    title: "Veri Analizi",
    description: "Doğru analizle doğru kararlar alın.",
    icon: "analytics" as const,
  },
  {
    title: "Kaynak Verimliliği",
    description: "Su, gübre ve zamanı verimli kullanın.",
    icon: "efficiency" as const,
  },
  {
    title: "Her Yerden Erişim",
    description: "Web ve mobil ile her an yanınızdayız.",
    icon: "mobile" as const,
  },
];

export const navLinks = [
  { href: "/cozum", label: "Çözüm" },
  { href: "/uygulama", label: "Uygulama" },
  { href: "/nasil-calisir", label: "Nasıl Çalışır" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/yatirimcilar", label: "Yatırımcılar" },
  { href: "/iletisim", label: "İletişim" },
  {
    href: "https://app.filizlen.io/login",
    label: "Uygulamaya git",
    external: true,
  },
];

export const products = [
  {
    id: "sense",
    name: "filizlen.io Sense",
    description:
      "Toprak nemi, hava ve hat verilerini toplayın. Tarlanızı gerçek zamanlı görün.",
    icon: "sensors" as const,
  },
  {
    id: "control",
    name: "filizlen.io Control",
    description:
      "Sulama ve gübreleme hatlarını uzaktan yönetin. Otomasyon kuralları ile iş gücünü azaltın.",
    icon: "control" as const,
  },
  {
    id: "cloud",
    name: "filizlen.io Cloud",
    description:
      "Geçmiş ve canlı veriyi analiz edin; sulama önerileri ve uyarılar alın. Abonelik ile güncel kalın.",
    icon: "cloud" as const,
  },
  {
    id: "proje",
    name: "filizlen.io Proje",
    description:
      "Keşif, tasarım, kurulum, eğitim ve destek — tek muhatap, anahtar teslim.",
    icon: "project" as const,
  },
];

export const segments = [
  {
    title: "Büyük tarlalar",
    description: "Çok parsel, uzaktan kontrol ve kurumsal raporlama.",
  },
  {
    title: "Seracılık",
    description: "Hassas nem ve sulama; hızlı müdahale, yüksek ürün kalitesi.",
  },
  {
    title: "Kooperatifler",
    description: "Merkezi izleme, şeffaf veri ve ölçeklenebilir altyapı.",
  },
];

export const dataFlowIntro = {
  summary:
    "Tarlada ölçüyoruz, bulutta birleştiriyoruz, web ve mobilde görüyorsunuz, birlikte karar veriyorsunuz, onaylanan komut vanalara gidiyor.",
  paragraph:
    "filizlen.io tek bir zincir kurar: veri tarlalardan gelir, filizlen.io Cloud'da toplanır, uygulama ve panelde izlenir, sistem sulama önerir ve siz onaylarsınız, ardından komutlar sulama hatlarına iletilir. Süreç döngü halinde devam eder.",
  footnote:
    "Saha sensör ve iletişim altyapısı iş ortaklarımızla kurulur; filizlen.io veriyi işler, saklar ve size karar + komut platformu sunar.",
};

/** Operasyon sırası — hero şeritleri ve akış diyagramı */
export const dataFlowPipeline = [
  { id: "sense", label: "Sense", tag: "Tarlada ölç" },
  { id: "cloud", label: "Cloud", tag: "Bulutta birleştir" },
  { id: "app", label: "App", tag: "İzle" },
  { id: "decision", label: "Karar", tag: "Öner & onayla" },
  { id: "control", label: "Control", tag: "Vanaya komut" },
] as const;

/** Müşteri dilinde operasyon akışı — ana sayfa + Nasıl Çalışır */
export const howItWorksSteps = [
  {
    step: "01",
    module: "Sense",
    title: "Tarlalardan veri",
    description:
      "Toprak nemi, sıcaklık ve hat verileri sensörlerle sürekli okunur; birden fazla tarla ve parsel aynı mantıkla izlenir.",
    detail:
      "Her parselde ölçüm cihazları çalışır. Veri kaybolmaz — dakikalar içinde toplanır ve bir sonraki adıma aktarılmaya hazır hale gelir. Mısır, buğday, ayçiçeği ve diğer ürünlerde aynı altyapı kullanılır.",
  },
  {
    step: "02",
    module: "Cloud",
    title: "Cloud'a aktarım",
    description:
      "Saha ölçümleri filizlen.io Cloud'da birleşir; canlı ve geçmiş veri tek kaynaktan okunur.",
    detail:
      "Farklı parsellerden gelen sinyaller tek havuzda toplanır. Dün gece ne olmuş, bu hafta ortalama nem ne — hepsi aynı platformda. Veriniz filizlen.io'da güvenle birikir ve karşılaştırılır.",
  },
  {
    step: "03",
    module: "App",
    title: "Web ve mobilde izleme",
    description:
      "Çiftlik yöneticisi ve saha ekibi telefondan veya bilgisayardan aynı canlı veriye bakar.",
    detail:
      "Parsel özeti, grafikler ve alarmlar tek ekranda. Ekip aynı veriyi konuşur; kimse farklı bir Excel veya kağıt defterine güvenmek zorunda kalmaz. Tarlanız hem masanızda hem cebinizdedir.",
  },
  {
    step: "04",
    module: "Cloud",
    title: "Karar verme",
    description:
      "Sistem eşik, trend ve geçmişe göre sulama önerir veya uyarır; kritik komutlar sizin onayınızla ilerler.",
    detail:
      "Veri analitiği devreye girer: nem düştü mü, sulama penceresi uygun mu, acil müdahale gerekir mi? Sistem öneri sunar — siz onaylarsınız veya kurala bırakırsınız. Karar ölçülebilir ve kayıt altındadır.",
  },
  {
    step: "05",
    module: "Control",
    title: "Vanalara komut",
    description:
      "Onayladığınız vana ve pompa komutları sahaya gider; uygulama durumu takip edilir.",
    detail:
      "Sulama başlat, vana aç, programı çalıştır — komut sıraya alınır ve tarlaya iletilir. Başarılı mı, gecikti mi, tekrar denensin mi? Sistem bunu da raporlar. Sulama operasyonu uzaktan, kontrollü yönetilir.",
  },
];

/** @deprecated use howItWorksSteps */
export const steps = howItWorksSteps;

export const team = [
  {
    role: "Yazılım Mühendisliği",
    description: "Platform, mobil uygulama ve saha entegrasyonları.",
  },
  {
    role: "Veri Bilimi",
    description: "Analitik, optimizasyon modelleri ve karar destek.",
  },
  {
    role: "Pazarlama",
    description: "Tarım ekosistemi, müşteri ve stratejik ortaklıklar.",
  },
];

export const appFeatures = [
  "Canlı tarla ve parsel özeti",
  "Sensör grafikleri ve eşik alarmları",
  "Uzaktan sulama ve vana kontrolü",
  "Optimizasyon önerileri ve onay akışı",
  "Çoklu tarla ve kooperatif görünümü",
  "Haftalık su ve enerji özeti",
];

export const problems = [
  "Su ve enerji maliyetleri artıyor; manuel sulama kaynak israf ediyor.",
  "Saha verisi dağınık; doğru karar geç ve pahalı geliyor.",
  "Tarla, sera ve kooperatifler ölçeklenebilir dijital operasyona ihtiyaç duyuyor.",
];
