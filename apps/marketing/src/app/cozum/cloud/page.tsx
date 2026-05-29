import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "filizlen.io Cloud",
  description: "Saha verisinin biriktiği, analiz edildiği ve karar desteğine dönüştüğü bulut platformu.",
};

const metrics = [
  "Canlı ve geçmiş veri panelleri",
  "Sulama önerisi ve alarm akışları",
  "Haftalık su/enerji performans raporları",
  "Çoklu tarla ve ekip görünümü",
];

export default function CloudPage() {
  return (
    <>
      <PageHero
        title="filizlen.io Cloud"
        description="Saha verisini tek noktada toplayın, analiz edin ve ölçülebilir operasyon kararları alın."
      />

      <AnimatedSection>
        <div className="mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-[1fr_1.1fr]">
          <article className="rounded-2xl border border-[rgba(34,197,94,0.18)] bg-[rgba(10,18,14,0.72)] p-7">
            <h2 className="text-2xl font-semibold text-foreground">Veri merkezi karar katmanı</h2>
            <p className="mt-4 text-muted leading-relaxed">
              filizlen.io Cloud, sensör ve kontrol verisini tek bir zaman çizgisinde birleştirir.
              Operatör ekibi neyin ne zaman olduğunu açıkça görür; optimizasyon kararları veri ile desteklenir.
            </p>
          </article>

          <ul className="grid gap-4 sm:grid-cols-2">
            {metrics.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-[rgba(34,197,94,0.2)] bg-[rgba(15,23,20,0.58)] px-4 py-4 text-sm font-medium text-foreground"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </AnimatedSection>

      <AnimatedSection className="bg-[#080f0c]">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h3 className="text-2xl font-semibold text-foreground">Veriyi değere dönüştürün</h3>
          <p className="mt-3 text-muted">
            Cloud katmanı ile sadece izlemeyin; kararları standartlaştırın ve verim artışını ölçün.
          </p>
          <div className="mt-6">
            <Button href="/iletisim">Cloud sunumu talep et</Button>
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}
