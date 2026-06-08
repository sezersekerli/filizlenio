import { FarmManagementView } from "@/components/farm/FarmManagementView";
import type { ParcelPlan } from "@/components/farm/FarmParcelPlans";
import { getServerApiClient } from "@/lib/api-server";
import type { FarmSummary, FarmTask, NotificationMessage, Parcel } from "@filizlen/shared";

async function loadParcelPlans(
  api: Awaited<ReturnType<typeof getServerApiClient>>,
  parcels: Parcel[],
  tasks: FarmTask[],
): Promise<ParcelPlan[]> {
  const pendingByParcel = new Map<string, string>();
  for (const task of tasks) {
    if (task.status === "pending" && !pendingByParcel.has(task.parcel_id)) {
      pendingByParcel.set(task.parcel_id, task.title);
    }
  }

  const plans: ParcelPlan[] = [];
  for (const parcel of parcels.slice(0, 12)) {
    let season = null;
    let weather = null;
    try {
      season = await api.getParcelSeason(parcel.id);
    } catch {
      // ignore
    }
    try {
      weather = await api.getParcelWeather(parcel.id);
    } catch {
      // ignore
    }
    plans.push({
      parcel,
      season,
      weather,
      nextTaskTitle: pendingByParcel.get(parcel.id) ?? null,
    });
  }
  return plans;
}

export default async function FarmPage() {
  let summary: FarmSummary | null = null;
  let tasks: FarmTask[] = [];
  let notifications: NotificationMessage[] = [];
  let plans: ParcelPlan[] = [];
  let error: string | null = null;

  try {
    const api = await getServerApiClient();
    const [summaryData, tasksData, notificationsData, parcels] = await Promise.all([
      api.getFarmSummary(),
      api.listFarmTasks(),
      api.listNotifications(),
      api.listParcels(),
    ]);
    summary = summaryData;
    tasks = tasksData;
    notifications = notificationsData;
    plans = await loadParcelPlans(api, parcels, tasksData);
  } catch (e) {
    error = e instanceof Error ? e.message : "Tarla yönetimi verileri yüklenemedi";
  }

  return (
    <FarmManagementView
      summary={summary}
      tasks={tasks}
      notifications={notifications}
      plans={plans}
      error={error}
    />
  );
}
