import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ProductCard } from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/Button";
import { products } from "@/lib/content";

export const metadata: Metadata = {
  title: "Çözüm",
  description:
    "Filizlen Sense, Control, Cloud ve Proje — uçtan uca akıllı sulama ve Tarım 5.0.",
};

const details = [
  {
    title: "Filizlen Sense",
    body: "Toprak nemi, hava koşulları ve hidrolik hat verilerini toplayın. Sensör kitleri ile tarlanızı gerçek zamanlı izleyin; Filizlen Cloud ve App üzerinden erişin.",
  },
  {
    title: "Filizlen Control",
    body: "Kontrolör ve otomasyon ile sulama ve gübreleme hatlarını uzaktan yönetin. Vana, pompa ve programlama tek merkezden; iş gücünü minimuma indirin.",
  },
  {
    title: "Filizlen Cloud",
    body: "Abonelik tabanlı bulut platformu: analitik, alarm, raporlama ve optimizasyon önerileri. Geçmiş veriyi kullanarak sulama stratejinizi sürekli iyileştirin.",
  },
  {
    title: "Filizlen Proje",
    body: "Keşif, tasarım, kurulum, devreye alma ve eğitim — anahtar teslim. Büyük tarla, sera ve kooperatifler için tek muhatap çözüm.",
  },
];

export default function CozumPage() {
  return (
    <>
      <PageHero
        title="Uçtan uca Tarım 5.0"
        description="Sahadan veri toplama, otomasyon, bulutta analiz ve optimizasyon, mobilde günlük kontrol — hepsi Filizlen ekosisteminde."
      />

      <AnimatedSection>
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p, i) => (
              <ProductCard
                key={p.id}
                name={p.name}
                description={p.description}
                icon={p.icon}
                index={i}
              />
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="bg-[#080f0c]">
        <div className="mx-auto max-w-6xl space-y-16 px-6">
          {details.map((item) => (
            <article
              key={item.title}
              className="grid gap-6 border-b border-[rgba(34,197,94,0.1)] pb-16 last:border-0 last:pb-0 md:grid-cols-[1fr_2fr]"
            >
              <h2 className="text-2xl font-bold text-primary">{item.title}</h2>
              <p className="text-muted leading-relaxed">{item.body}</p>
            </article>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection>
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-muted">
            Teklif, keşif ve kurulum planı için iletişime geçin.
          </p>
          <div className="mt-6">
            <Button href="/iletisim">İletişim</Button>
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}
