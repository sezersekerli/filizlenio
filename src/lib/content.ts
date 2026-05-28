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

/** Müşteri dilinde operasyon akışı — ana sayfa + Nasıl Çalışır */
export const howItWorksSteps = [
  {
    step: "01",
    title: "Saha ölçümü",
    description:
      "Toprak nemi, basınç ve hat verileri sensörlerle sürekli okunur. Mısır, buğday, ayçiçeği ve diğer ürünlerde aynı mantıkla izlenir.",
  },
  {
    step: "02",
    title: "Buluta aktarım",
    description:
      "Saha sinyalleri filizlen.io Cloud'da birleşir; geçmiş ve canlı veri tek kaynakta birikir.",
  },
  {
    step: "03",
    title: "Web + mobil izleme",
    description:
      "Tüm parselleri tek panelden takip edersiniz; ekip aynı veriye bakarak karar verir.",
  },
  {
    step: "04",
    title: "Akıllı öneri",
    description:
      "Sistem ne zaman ve ne kadar sulama yapılacağını önerir; kritik durumlarda uyarı üretir.",
  },
  {
    step: "05",
    title: "Komut uygulama",
    description:
      "Onayladığınız vana aç/kapat komutları sahaya anında gider; sulama operasyonu uzaktan yönetilir.",
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
