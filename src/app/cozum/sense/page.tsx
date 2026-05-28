import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "filizlen.io Sense",
  description: "Toprak, hat ve saha verisini gerçek zamanlı izleyen sensör katmanı.",
};

const features = [
  "Toprak nemi, sıcaklık ve saha sinyallerini anlık izleme",
  "Geniş tarla, sera ve farklı ürün desenlerinde esnek kurulum",
  "filizlen.io Cloud ile sürekli veri akışı ve alarm üretimi",
  "Web + mobil panelde tek ekranda geçmiş ve canlı görünüm",
];

const modules = [
  {
    title: "Toprak Sensörü Modülü",
    text: "Parsel bazında nem ve saha koşullarını sürekli takip eder.",
  },
  {
    title: "Kablosuz Geçit Modülü",
    text: "Sahadan gelen veriyi güvenli biçimde bulut katmanına taşır.",
  },
  {
    title: "Datalogger Modülü",
    text: "Kesintisiz veri kaydı sağlayarak geçmiş analizlerini güçlendirir.",
  },
];

export default function SensePage() {
  return (
    <>
      <PageHero
        title="filizlen.io Sense"
        description="Sahadaki veriyi doğru noktadan toplar, sulama kararlarının temelini oluşturur."
      />

      <AnimatedSection>
        <div className="mx-auto max-w-6xl space-y-8 px-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Neden filizlen.io Sense?</h2>
            <p className="text-muted">
              filizlen.io Sense, sensör verisini sadece toplamaz; sahadaki gerçek durumu
              karar verilebilir bir akışa dönüştürür. Böylece sulama, tahminle değil
              ölçümle yönetilir.
            </p>
            <ul className="space-y-3">
              {features.map((feature) => (
                <li
                  key={feature}
                  className="rounded-xl border border-[rgba(34,197,94,0.2)] bg-[rgba(15,23,20,0.55)] px-4 py-3 text-sm text-muted"
                >
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {modules.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-[rgba(34,197,94,0.2)] bg-[rgba(8,15,12,0.7)] p-5"
              >
                <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="bg-[#080f0c]">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h3 className="text-2xl font-semibold text-foreground">Kurulum ve teklif planı</h3>
          <p className="mt-3 text-muted">
            Tarla yapınıza göre sensör yerleşimi, cihaz adedi ve veri planını birlikte çıkaralım.
          </p>
          <div className="mt-6">
            <Button href="/iletisim">Sense için görüşme planla</Button>
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}
