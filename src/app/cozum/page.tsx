import type { Metadata } from "next";
import { CozumPageContent } from "@/components/cozum/CozumPageContent";

export const metadata: Metadata = {
  title: "Çözüm",
  description:
    "filizlen.io Sense, Control, Cloud ve Proje — uçtan uca akıllı sulama ve Tarım 5.0.",
};

export default function CozumPage() {
  return <CozumPageContent />;
}
