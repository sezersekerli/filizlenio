import type { Metadata } from "next";
import { UygulamaContent } from "./UygulamaContent";

export const metadata: Metadata = {
  title: "Uygulama",
  description: "filizlen.io mobil uygulama — tarla kontrolü, sensörler ve optimizasyon önerileri.",
};

export default function UygulamaPage() {
  return <UygulamaContent />;
}
