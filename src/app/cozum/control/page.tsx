import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "filizlen.io Control",
  description: "Vana, pompa ve sulama hatlarını uzaktan yöneten kontrol katmanı.",
};

const blocks = [
  {
    title: "Uzaktan Vana Yönetimi",
    text: "Parsel bazında vana aç/kapat komutları web ve mobil panelden güvenli şekilde uygulanır.",
  },
  {
    title: "Planlı Sulama Senaryoları",
    text: "Gün, saat ve süre bazlı otomasyon kurguları ile operasyon tekrar eden bir düzene alınır.",
  },
  {
    title: "Saha Güvenliği",
    text: "Komut geçmişi, kullanıcı yetkisi ve olay kayıtları ile tüm aksiyonlar izlenebilir hale gelir.",
  },
];

export default function ControlPage() {
  return (
    <>
      <PageHero
        title="filizlen.io Control"
        description="Sahadaki vana ve sulama ekipmanlarını tek panelden yönetin, manuel yükü azaltın."
      />

      <AnimatedSection>
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {blocks.map((block) => (
              <article
                key={block.title}
                className="rounded-2xl border border-[rgba(34,197,94,0.18)] bg-[rgba(10,18,14,0.72)] p-6"
              >
                <h2 className="text-lg font-semibold text-foreground">{block.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">{block.text}</p>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="bg-[#080f0c]">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h3 className="text-2xl font-semibold text-foreground">Operasyonu tek merkezden yönet</h3>
          <p className="mt-3 text-muted">
            filizlen.io Control ile sulama komutlarını standartlaştırın, saha ekibinin zamanını optimize edin.
          </p>
          <div className="mt-6">
            <Button href="/iletisim">Control için demo al</Button>
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}
