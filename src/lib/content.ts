export const site = {
  name: "Filizlen",
  domain: "filizlen.io",
  title: "filizlen.io Akıllı tarım",
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
    name: "Filizlen Sense",
    description:
      "Toprak nemi, hava ve hat verilerini toplayın. Tarlanızı gerçek zamanlı görün.",
    icon: "sensors" as const,
  },
  {
    id: "control",
    name: "Filizlen Control",
    description:
      "Sulama ve gübreleme hatlarını uzaktan yönetin. Otomasyon kuralları ile iş gücünü azaltın.",
    icon: "control" as const,
  },
  {
    id: "cloud",
    name: "Filizlen Cloud",
    description:
      "Geçmiş ve canlı veriyi analiz edin; sulama önerileri ve uyarılar alın. Abonelik ile güncel kalın.",
    icon: "cloud" as const,
  },
  {
    id: "proje",
    name: "Filizlen Proje",
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

export const steps = [
  {
    step: "01",
    title: "Keşif",
    description: "Arazi, ürün ve mevcut sulama altyapısı analiz edilir.",
  },
  {
    step: "02",
    title: "Kurulum",
    description: "Sensör, kontrolör ve saha entegrasyonu devreye alınır.",
  },
  {
    step: "03",
    title: "Bağlantı",
    description: "Filizlen Cloud ve App ile eğitim ve canlı izleme başlar.",
  },
  {
    step: "04",
    title: "Optimizasyon",
    description: "Veri birikimiyle sulama programı sürekli iyileştirilir.",
  },
];

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
