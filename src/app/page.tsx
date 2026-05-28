import type { Metadata } from "next";
import { HomePageContent } from "@/components/home/HomePageContent";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: { absolute: `Anasayfa · ${site.domain}` },
  description: `${site.valueProposition} ${site.slogan}`,
};

export default function HomePage() {
  return <HomePageContent />;
}
