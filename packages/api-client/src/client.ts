import type {
  CreateExpenseInput,
  CreateFarmTaskInput,
  CreateNotificationInput,
  CreateParcelEventInput,
  CreateParcelInput,
  Entitlement,
  Expense,
  FarmSummary,
  FarmTask,
  NotificationMessage,
  Parcel,
  ParcelEvent,
  ParcelSeason,
  TkgmIl,
  TkgmIlce,
  TkgmMahalle,
  UpdateFarmTaskInput,
  UpsertParcelSeasonInput,
  WeatherSnapshot,
} from "@filizlen/shared";

export interface TkgmParselMeta {
  area_m2: number | null;
  nitelik: string | null;
  location: {
    il: string | null;
    ilce: string | null;
    mahalle: string | null;
  };
  ozet: string | null;
  pafta: string | null;
  zeminKmdurum: string | null;
}

export type TkgmParselResponse = GeoJSON.Feature & { meta?: TkgmParselMeta };

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

  getIller() {
    return this.request<TkgmIl[]>("/tkgm/iller");
  }

  getIlceler(ilId: number) {
    return this.request<TkgmIlce[]>(`/tkgm/ilceler/${ilId}`);
  }

  getMahalleler(ilceId: number) {
    return this.request<TkgmMahalle[]>(`/tkgm/mahalleler/${ilceId}`);
  }

  getParselGeoJson(mahalleId: number, ada: string, parsel: string) {
    return this.request<TkgmParselResponse>(
      `/tkgm/parsel/${mahalleId}/${encodeURIComponent(ada)}/${encodeURIComponent(parsel)}`,
    );
  }

  syncParcelTkgm(id: string) {
    return this.request<Parcel>(`/parcels/${id}/tkgm/sync`, { method: "POST" });
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

  getFarmSummary() {
    return this.request<FarmSummary>("/farm/summary");
  }

  listFarmTasks(date?: string) {
    const q = date ? `?date=${encodeURIComponent(date)}` : "";
    return this.request<FarmTask[]>(`/farm/tasks${q}`);
  }

  createFarmTask(data: CreateFarmTaskInput) {
    return this.request<FarmTask>("/farm/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  updateFarmTask(id: string, data: UpdateFarmTaskInput) {
    return this.request<FarmTask>(`/farm/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  listNotifications() {
    return this.request<NotificationMessage[]>("/farm/notifications");
  }

  previewNotification(data: CreateNotificationInput) {
    return this.request<NotificationMessage>("/farm/notifications/preview", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  getParcelSeason(parcelId: string) {
    return this.request<ParcelSeason | null>(`/parcels/${parcelId}/season`);
  }

  upsertParcelSeason(parcelId: string, data: UpsertParcelSeasonInput) {
    return this.request<ParcelSeason>(`/parcels/${parcelId}/season`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  listParcelExpenses(parcelId: string) {
    return this.request<Expense[]>(`/parcels/${parcelId}/expenses`);
  }

  createExpense(parcelId: string, data: CreateExpenseInput) {
    return this.request<Expense>(`/parcels/${parcelId}/expenses`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  getParcelWeather(parcelId: string) {
    return this.request<WeatherSnapshot>(`/parcels/${parcelId}/weather`);
  }

  listParcelTasks(parcelId: string) {
    return this.request<FarmTask[]>(`/parcels/${parcelId}/tasks`);
  }

  listEntitlements() {
    return this.request<Entitlement[]>("/entitlements");
  }
}
