import type { Parcel } from "@filizlen/shared";
import { cache } from "react";
import { getServerApiClient } from "./api-server";
import { safeServerFetch } from "./server-fetch";

export const fetchParcels = cache(async (): Promise<{
  parcels: Parcel[];
  error: string | null;
}> => {
  const result = await safeServerFetch(
    async () => (await getServerApiClient()).listParcels(),
    "Parseller yüklenemedi",
  );
  return {
    parcels: result.ok ? result.data : [],
    error: result.error,
  };
});
