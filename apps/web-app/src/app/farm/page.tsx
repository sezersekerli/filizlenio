import { FarmManagementView } from "@/components/farm/FarmManagementView";
import type { ParcelPlan } from "@/components/farm/FarmParcelPlans";
import { loadFarmActivity, loadFarmPendingTasks } from "@/lib/farm-page";
import { getServerApiClient } from "@/lib/api-server";
import type { FarmActivityItem, FarmSummary, FarmTask, Parcel } from "@filizlen/shared";

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

  return Promise.all(
    parcels.slice(0, 8).map(async (parcel) => {
      const [season, weather] = await Promise.all([
        api.getParcelSeason(parcel.id).catch(() => null),
        api.getParcelWeather(parcel.id).catch(() => null),
      ]);
      return {
        parcel,
        season,
        weather,
        nextTaskTitle: pendingByParcel.get(parcel.id) ?? null,
      };
    }),
  );
}

export default async function FarmPage() {
  let summary: FarmSummary | null = null;
  let tasks: FarmTask[] = [];
  let activity: FarmActivityItem[] = [];
  let plans: ParcelPlan[] = [];
  let parcels: Parcel[] = [];
  const errors: string[] = [];

  const api = await getServerApiClient();

  const [summaryResult, tasksResult, activityResult, parcelsResult] =
    await Promise.allSettled([
      api.getFarmSummary(),
      loadFarmPendingTasks(),
      loadFarmActivity(5),
      api.listParcels(),
    ]);

  if (summaryResult.status === "fulfilled") {
    summary = summaryResult.value;
  } else {
    errors.push(
      summaryResult.reason instanceof Error
        ? summaryResult.reason.message
        : "Özet yüklenemedi",
    );
  }

  if (tasksResult.status === "fulfilled") {
    tasks = tasksResult.value;
  }

  if (activityResult.status === "fulfilled") {
    activity = activityResult.value;
  }

  if (parcelsResult.status === "fulfilled") {
    parcels = parcelsResult.value;
    try {
      plans = await loadParcelPlans(api, parcels, tasks);
    } catch (e) {
      errors.push(e instanceof Error ? e.message : "Parsel planları yüklenemedi");
    }
  } else {
    errors.push(
      parcelsResult.reason instanceof Error
        ? parcelsResult.reason.message
        : "Parseller yüklenemedi",
    );
  }

  return (
    <FarmManagementView
      summary={summary}
      parcelCount={parcels.length}
      tasks={tasks}
      activity={activity}
      plans={plans}
      error={errors.length > 0 ? errors.join(" · ") : null}
    />
  );
}
