import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Nasıl Çalışır",
  description:
    "filizlen.io operasyon akışı: saha ölçümü, bulut, izleme, akıllı öneri ve vana komutu.",
};

export default function NasilCalisirPage() {
  return (
    <>
      <PageHero
        title="Sistem nasıl çalışır?"
        description="Kurulum sürecinden sonra günlük operasyon net bir akışla ilerler: ölç, birleştir, izle, karar ver, uygula."
      />

      <HowItWorks showCta={false} compact />

      <AnimatedSection className="bg-[#080f0c]">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-2xl font-semibold text-foreground">Kurulum tarafı</h2>
          <p className="mt-4 text-muted leading-relaxed">
            İlk keşif ve saha kurulumu tamamlandıktan sonra yukarıdaki 5 adımlık akış günlük
            operasyonunuz olur. filizlen.io Proje ekibi keşif, kurulum ve eğitimi tek muhatap
            olarak yönetir.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href="/cozum/proje" variant="secondary">
              Kurulum süreci
            </Button>
            <Button href="/iletisim">Demo ve teklif alın</Button>
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}
