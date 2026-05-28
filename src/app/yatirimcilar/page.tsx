import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/Button";
import { TrendingUp, Layers, MapPin, Cpu } from "lucide-react";

export const metadata: Metadata = {
  title: "Yatırımcılar",
  description:
    "Filizlen — pre-seed / seed aşamasında AgTech yatırım fırsatı. Türkiye, akıllı sulama ve SaaS.",
};

const highlights = [
  {
    icon: TrendingUp,
    title: "Problem",
    text: "Tarımda su tüketimi, enerji maliyeti ve operasyonel verimsizlik; dijitalleşme ihtiyacı.",
  },
  {
    icon: Cpu,
    title: "Çözüm",
    text: "Donanım + SaaS + mobil app; optimizasyon ve analitik odaklı akıllı sulama.",
  },
  {
    icon: MapPin,
    title: "Pazar",
    text: "Türkiye — tarla, sera, kooperatif segmentleri.",
  },
  {
    icon: Layers,
    title: "İş modeli",
    text: "Donanım ve proje geliri + Filizlen Cloud aboneliği (ARR).",
  },
];

export default function YatirimcilarPage() {
  return (
    <>
      <PageHero
        title="Tarım 5.0'da erken aşama"
        description="Pre-seed / seed — traction'a göre yapılandırılacak tur. Türkiye odaklı AgTech."
      />

      <AnimatedSection>
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {highlights.map(({ icon: Icon, title, text }) => (
              <article key={title} className="glass-card rounded-2xl p-6">
                <Icon className="mb-4 h-8 w-8 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                <p className="mt-2 text-sm text-muted">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="bg-[#080f0c]">
        <div className="mx-auto max-w-3xl px-6 space-y-6 text-muted leading-relaxed">
          <h2 className="text-xl font-semibold text-foreground">Ürün durumu</h2>
          <p>
            Filizlen ekosistemi sahada aktif; kurulumlar ölçekleniyor. Gelir: donanım,
            anahtar teslim proje ve abonelik tabanlı Filizlen Cloud.
          </p>
          <h2 className="text-xl font-semibold text-foreground">Fon kullanımı (özet)</h2>
          <ul className="list-inside list-disc space-y-2">
            <li>Ürünleştirme ve mobil uygulama</li>
            <li>Saha operasyonları ve kurulum ölçeklemesi</li>
            <li>Sertifikasyon, lojistik ve büyüme</li>
          </ul>
        </div>
      </AnimatedSection>

      <AnimatedSection>
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-muted">Yatırımcı özeti ve görüşme için iletişime geçin.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button href="/iletisim">İletişim</Button>
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}
