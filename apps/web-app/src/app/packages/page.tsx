import { UpsellCards } from "@/components/packages/UpsellCards";
import { PageHeader } from "@/components/ui/PageHeader";
import { getServerApiClient } from "@/lib/api-server";

export default async function PackagesPage() {
  let entitlements: Awaited<
    ReturnType<Awaited<ReturnType<typeof getServerApiClient>>["listEntitlements"]>
  > = [];

  try {
    entitlements = await (await getServerApiClient()).listEntitlements();
  } catch {
    entitlements = [];
  }

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Filizlen paketleri"
        title="Sense · Cloud · Control"
        description="Sensör, AI öneri ve uzaktan kontrol katmanlarını parsellerinize ekleyin."
      />
      <UpsellCards entitlements={entitlements} />
    </div>
  );
}
