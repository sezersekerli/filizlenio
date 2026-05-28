import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ContactForm } from "@/components/contact/ContactForm";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "İletişim",
  description: "Filizlen satış, kurulum, destek ve yatırım görüşmeleri.",
};

export default function IletisimPage() {
  return (
    <>
      <PageHero
        title="İletişime geçin"
        description="Teklif, kurulum, destek, yatırım veya basın için formu doldurun."
      />

      <AnimatedSection>
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Doğrudan e-posta</h2>
            <a
              href={`mailto:${site.email}`}
              className="mt-4 inline-flex items-center gap-2 text-primary hover:underline"
            >
              <Mail className="h-5 w-5" />
              {site.email}
            </a>
            <p className="mt-8 text-sm text-muted">
              Yanıt süresi: iş günlerinde 1–2 gün. Kurulum, operasyon ve yatırım
              taleplerine öncelik veriyoruz.
            </p>
          </div>
          <ContactForm />
        </div>
      </AnimatedSection>
    </>
  );
}
