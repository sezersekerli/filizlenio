import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { team } from "@/lib/content";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "filizlen.io — Türkiye odaklı Tarım 5.0 startup. Veri bilimi ve yazılımla akıllı sulama.",
};

export default function HakkimizdaPage() {
  return (
    <>
      <PageHero
        title="Türkiye için Tarım 5.0"
        description="Su ve verim baskısı altındaki tarımda, veriyi merkeze alan sulama teknolojisi geliştiriyoruz."
      />

      <AnimatedSection>
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-lg leading-relaxed text-muted">
            filizlen.io, tarım işletmeleri, seralar ve kooperatifler için analitik ve
            optimizasyon odaklı akıllı sulama sistemleri geliştirir. Sensörlerden
            kontrolöre, bulut yazılımından mobil uygulamaya ve anahtar teslim
            projeye kadar uçtan uca çözüm sunmayı hedefliyoruz.
          </p>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            Önce Türkiye pazarına odaklanıyoruz; sulamayı ölçülebilir, otomatik ve
            kârlı hale getirerek su, enerji ve girdi maliyetlerini düşürmeyi
            amaçlıyoruz. filizlen.io ekosistemi sahada aktif olarak çalışıyor; farklı
            işletme tiplerinde operasyonel kurulumları ölçekliyoruz.
          </p>
        </div>
      </AnimatedSection>

      <AnimatedSection className="bg-[#080f0c]">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading eyebrow="Ekip" title="Disiplinler arası ekip" />
          <div className="grid gap-6 md:grid-cols-3">
            {team.map((member) => (
              <article key={member.role} className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-primary">{member.role}</h3>
                <p className="mt-2 text-sm text-muted">{member.description}</p>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection>
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-2xl font-bold text-foreground">Vizyon</h2>
          <p className="mt-4 text-muted leading-relaxed">
            Türkiye&apos;den başlayarak, analitik destekli sulamayı her ölçekte
            erişilebilir kılmak — tarımın dijital dönüşümünde güvenilir bir
            teknoloji ortağı olmak.
          </p>
        </div>
      </AnimatedSection>
    </>
  );
}
