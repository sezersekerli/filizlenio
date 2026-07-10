import type {
  CreateExpenseInput,
  CreateFarmTaskInput,
  CreateNotificationInput,
  CreateParcelEventInput,
  CreateParcelInput,
  Entitlement,
  Expense,
  ExpenseWithParcel,
  FarmActivityItem,
  FarmSummary,
  FarmTask,
  NotificationMessage,
  NotificationSettings,
  UpdateNotificationSettingsInput,
  Parcel,
  ParcelEvent,
  ParcelEventWithParcel,
  ParcelSeason,
  SpectralTimeline,
  SpectralTimelineBucket,
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

  listFarmExpenses() {
    return this.request<ExpenseWithParcel[]>("/farm/expenses");
  }

  listFarmEvents() {
    return this.request<ParcelEventWithParcel[]>("/farm/events");
  }

  listFarmTasks(params?: { status?: string; scope?: string; date?: string }) {
    const search = new URLSearchParams();
    if (params?.status) search.set("status", params.status);
    if (params?.scope) search.set("scope", params.scope);
    if (params?.date) search.set("date", params.date);
    const q = search.toString();
    return this.request<FarmTask[]>(`/farm/tasks${q ? `?${q}` : ""}`);
  }

  listFarmActivity(params?: { limit?: number; before?: string }) {
    const search = new URLSearchParams();
    if (params?.limit != null) search.set("limit", String(params.limit));
    if (params?.before) search.set("before", params.before);
    const q = search.toString();
    return this.request<FarmActivityItem[]>(`/farm/activity${q ? `?${q}` : ""}`);
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

  getNotificationSettings() {
    return this.request<NotificationSettings>("/farm/notifications/settings");
  }

  updateNotificationSettings(data: UpdateNotificationSettingsInput) {
    return this.request<NotificationSettings>("/farm/notifications/settings", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  dispatchNotifications() {
    return this.request<{ scanned: boolean; sent: number }>(
      "/farm/notifications/dispatch",
      { method: "POST" },
    );
  }

  sendNotification(id: string) {
    return this.request<NotificationMessage>(`/farm/notifications/${id}/send`, {
      method: "POST",
    });
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

  listParcelTasks(parcelId: string, status?: string) {
    const q = status ? `?status=${encodeURIComponent(status)}` : "";
    return this.request<FarmTask[]>(`/parcels/${parcelId}/tasks${q}`);
  }

  listParcelActivity(parcelId: string, params?: { limit?: number; before?: string }) {
    const search = new URLSearchParams();
    if (params?.limit != null) search.set("limit", String(params.limit));
    if (params?.before) search.set("before", params.before);
    const q = search.toString();
    return this.request<FarmActivityItem[]>(
      `/parcels/${parcelId}/activity${q ? `?${q}` : ""}`,
    );
  }

  listEntitlements() {
    return this.request<Entitlement[]>("/entitlements");
  }

  syncParcelSatellite(parcelId: string, force = false) {
    const q = force ? "?force=true" : "";
    return this.request<{ synced: number }>(
      `/parcels/${parcelId}/satellite/sync${q}`,
      { method: "POST" },
    );
  }

  getParcelSpectralTimeline(parcelId: string, bucket: SpectralTimelineBucket = "week") {
    return this.request<SpectralTimeline>(
      `/parcels/${parcelId}/satellite/timeline?bucket=${bucket}`,
    );
  }
}
