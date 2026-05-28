import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Gizlilik ve KVKK",
};

export default function GizlilikPage() {
  return (
    <>
      <PageHero
        title="Gizlilik ve KVKK"
        description="Kişisel verilerinizin korunmasına ilişkin özet bilgilendirme."
      />

      <AnimatedSection>
        <div className="mx-auto max-w-3xl space-y-6 px-6 text-sm leading-relaxed text-muted">
          <p>
            <strong className="text-foreground">Veri sorumlusu:</strong> Filizlen
            (filizlen.io). İletişim: {site.email}
          </p>
          <p>
            İletişim formu aracılığıyla toplanan ad, kurum, e-posta, telefon ve mesaj
            bilgileri; talebinize yanıt vermek, satış, kurulum ve iş geliştirme süreçlerini
            yürütmek amacıyla işlenir.
          </p>
          <p>
            Verileriniz yasal yükümlülükler dışında üçüncü taraflarla paylaşılmaz.
            KVKK kapsamındaki haklarınız (erişim, düzeltme, silme, itiraz) için{" "}
            {site.email} adresine başvurabilirsiniz.
          </p>
          <p className="text-xs">Son güncelleme: Mayıs 2026</p>
        </div>
      </AnimatedSection>
    </>
  );
}
