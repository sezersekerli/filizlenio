import type { Metadata } from "next";
import { NasilCalisirContent } from "@/components/nasil-calisir/NasilCalisirContent";

export const metadata: Metadata = {
  title: "Nasıl Çalışır",
  description:
    "filizlen.io operasyon akışı: tarlada ölçüm, bulutta birleştirme, izleme, karar ve vana komutu.",
};

export default function NasilCalisirPage() {
  return <NasilCalisirContent />;
}
