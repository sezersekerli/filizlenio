import { getServerApiClient } from "@/lib/api-server";
import { safeServerFetch } from "@/lib/server-fetch";
import type { FarmActivityItem, FarmTask } from "@filizlen/shared";
import { cache } from "react";

export const loadFarmPendingTasks = cache(async (): Promise<FarmTask[]> => {
  const api = await getServerApiClient();
  const result = await safeServerFetch(() =>
    api.listFarmTasks({ status: "pending", scope: "week" }),
  );
  return result.ok ? result.data : [];
});

export const loadFarmActivity = cache(
  async (limit = 30): Promise<FarmActivityItem[]> => {
    const api = await getServerApiClient();
    const result = await safeServerFetch(() => api.listFarmActivity({ limit }));
    return result.ok ? result.data : [];
  },
);
