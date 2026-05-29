import type {
  CreateParcelEventInput,
  CreateParcelInput,
} from "@filizlen/shared";
import type { Parcel, ParcelEvent, TkgmIlce, TkgmMahalle } from "@filizlen/shared";

export interface ApiClientConfig {
  baseUrl: string;
  getAccessToken?: () => Promise<string | null>;
  credentials?: RequestCredentials;
}

export class FilizlenApiClient {
  constructor(private config: ApiClientConfig) {}

  private async request<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    const token = await this.config.getAccessToken?.();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${this.config.baseUrl}${path}`, {
      ...options,
      headers,
      credentials: this.config.credentials,
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`API ${res.status}: ${body || res.statusText}`);
    }

    if (res.status === 204) {
      return undefined as T;
    }

    return res.json() as Promise<T>;
  }

  health() {
    return this.request<{ status: string; service: string }>("/health");
  }

  getIlceler(ilId: number) {
    return this.request<TkgmIlce[]>(`/tkgm/ilceler/${ilId}`);
  }

  getMahalleler(ilceId: number) {
    return this.request<TkgmMahalle[]>(`/tkgm/mahalleler/${ilceId}`);
  }

  getParselGeoJson(mahalleId: number, ada: string, parsel: string) {
    return this.request<GeoJSON.Feature>(
      `/tkgm/parsel/${mahalleId}/${encodeURIComponent(ada)}/${encodeURIComponent(parsel)}`,
    );
  }

  listParcels() {
    return this.request<Parcel[]>("/parcels");
  }

  getParcel(id: string) {
    return this.request<Parcel>(`/parcels/${id}`);
  }

  createParcel(data: CreateParcelInput) {
    return this.request<Parcel>("/parcels", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  deleteParcel(id: string) {
    return this.request<void>(`/parcels/${id}`, { method: "DELETE" });
  }

  listParcelEvents(parcelId: string) {
    return this.request<ParcelEvent[]>(`/parcels/${parcelId}/events`);
  }

  createParcelEvent(parcelId: string, data: CreateParcelEventInput) {
    return this.request<ParcelEvent>(`/parcels/${parcelId}/events`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}
