import { UpsellCards } from "@/components/packages/UpsellCards";
import { PageHeader } from "@/components/ui/PageHeader";

export default function PackagesPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Premium"
        title="Paketler"
        description="Sense, Cloud ve Control ile tarlanızı bir üst seviyeye taşıyın. Ücretsiz hesabınız aynı kalır — paket parsel bazında eklenir."
      />
      <UpsellCards />
    </div>
  );
}
