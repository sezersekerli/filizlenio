import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "filizlen.io Proje",
  description: "Keşiften devreye almaya kadar uçtan uca kurulum ve operasyon desteği.",
};

const phases = [
  {
    step: "01",
    title: "Keşif ve Tasarım",
    text: "Arazi yapısı, ürün deseni ve mevcut altyapı analiz edilerek doğru kurulum planı hazırlanır.",
  },
  {
    step: "02",
    title: "Kurulum ve Devreye Alma",
    text: "Sensör, kontrolör ve saha bileşenleri entegre edilir; sistem aktif çalışmaya alınır.",
  },
  {
    step: "03",
    title: "Eğitim ve Operasyon Desteği",
    text: "Ekipler web/mobil kullanımına alınır, saha operasyonları düzenli olarak optimize edilir.",
  },
];

export default function ProjePage() {
  return (
    <>
      <PageHero
        title="filizlen.io Proje"
        description="Tekliften kurulum sonrasına kadar tek muhatapla ilerleyin, süreci hızlandırın."
      />

      <AnimatedSection>
        <div className="mx-auto max-w-6xl space-y-5 px-6">
          {phases.map((phase) => (
            <article
              key={phase.step}
              className="grid gap-4 rounded-2xl border border-[rgba(34,197,94,0.2)] bg-[rgba(10,18,14,0.72)] p-6 md:grid-cols-[100px_1fr]"
            >
              <p className="text-3xl font-bold text-primary">{phase.step}</p>
              <div>
                <h2 className="text-xl font-semibold text-foreground">{phase.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{phase.text}</p>
              </div>
            </article>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection className="bg-[#080f0c]">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h3 className="text-2xl font-semibold text-foreground">Anahtar teslim süreç yönetimi</h3>
          <p className="mt-3 text-muted">
            filizlen.io Proje ile kurum içi ekiplerinizin yükünü azaltın, sahaya hızlı ve düzenli geçiş yapın.
          </p>
          <div className="mt-6">
            <Button href="/iletisim">Proje planı çıkaralım</Button>
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}
