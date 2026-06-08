import type { Parcel } from "@filizlen/shared";
import { getServerApiClient } from "./api-server";

export async function fetchParcels(): Promise<{ parcels: Parcel[]; error: string | null }> {
  try {
    const parcels = await (await getServerApiClient()).listParcels();
    return { parcels, error: null };
  } catch (e) {
    return {
      parcels: [],
      error: e instanceof Error ? e.message : "Parseller yüklenemedi",
    };
  }
}
