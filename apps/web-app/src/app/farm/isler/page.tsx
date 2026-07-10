import { FarmTasksView } from "@/components/farm/FarmTasksView";
import { loadFarmActivity, loadFarmPendingTasks } from "@/lib/farm-page";
import { getServerApiClient } from "@/lib/api-server";
import { safeServerFetchAll } from "@/lib/server-fetch";
import type { FarmSummary, Parcel } from "@filizlen/shared";
import { Suspense } from "react";

async function FarmTasksContent() {
  const api = await getServerApiClient();
  const result = await safeServerFetchAll<[Parcel[], FarmSummary | null]>(
    [() => api.listParcels(), () => api.getFarmSummary().catch(() => null)],
    "İşler yüklenemedi",
  );

  const [tasks, activity] = await Promise.all([
    loadFarmPendingTasks(),
    loadFarmActivity(30),
  ]);

  if (!result.ok) {
    return (
      <FarmTasksView
        parcels={[]}
        initialTasks={tasks}
        initialActivity={activity}
        loadError={result.error}
      />
    );
  }

  const [parcels, summary] = result.data;
  const taskBadge =
    (summary?.overdueTaskCount ?? 0) + (summary?.todayTaskCount ?? 0);

  return (
    <FarmTasksView
      parcels={parcels}
      initialTasks={tasks}
      initialActivity={activity}
      summaryBadge={taskBadge}
    />
  );
}

export default function FarmTasksPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted p-4">Yükleniyor…</p>}>
      <FarmTasksContent />
    </Suspense>
  );
}
