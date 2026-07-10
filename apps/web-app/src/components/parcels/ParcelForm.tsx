"use client";

import { ParcelMap } from "@/components/map/ParcelMapDynamic";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { TkgmParcelInfo } from "@/components/parcels/TkgmParcelInfo";
import { getApiClient } from "@/lib/api";
import { defaultTransition, fadeInUp } from "@/lib/motion";
import { parseTkgmAreaM2, TKGM_DISCLAIMER } from "@filizlen/shared";
import type { TkgmParselProperties } from "@filizlen/shared";
import type { TkgmParselResponse } from "@filizlen/api-client";
import { motion } from "framer-motion";
import { Loader2, Map, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const steps = ["Konum", "Ada/Parsel", "Harita"];

export function ParcelForm() {
  const router = useRouter();
  const api = getApiClient();

  const [ilId, setIlId] = useState<number | "">("");
  const [ilceId, setIlceId] = useState<number | "">("");
  const [mahalleId, setMahalleId] = useState<number | "">("");
  const [ada, setAda] = useState("");
  const [parselNo, setParselNo] = useState("");
  const [label, setLabel] = useState("");
  const [ilceler, setIlceler] = useState<{ id: number; ad: string }[]>([]);
  const [mahalleler, setMahalleler] = useState<{ id: number; ad: string }[]>([]);
  const [iller, setIller] = useState<{ id: number; ad: string }[]>([]);
  const [preview, setPreview] = useState<TkgmParselResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stepIndex =
    preview ? 2 : mahalleId && ada && parselNo ? 1 : ilId ? 0 : 0;

  useEffect(() => {
    api
      .getIller()
      .then((data) => {
        setIller(data);
        if (data.length === 0) {
          setError("İl listesi boş döndü — lütfen sayfayı yenileyin.");
        }
      })
      .catch((e) => {
        setIller([]);
        setError(
          e instanceof Error
            ? `İl listesi yüklenemedi: ${e.message}`
            : "İl listesi yüklenemedi",
        );
      });
  }, [api]);

  const loadIlceler = useCallback(
    async (id: number) => {
      setIlceId("");
      setMahalleId("");
      setMahalleler([]);
      try {
        const data = await api.getIlceler(id);
        setIlceler(data);
      } catch {
        setIlceler([]);
      }
    },
    [api],
  );

  const loadMahalleler = useCallback(
    async (id: number) => {
      setMahalleId("");
      try {
        const data = await api.getMahalleler(id);
        setMahalleler(data);
      } catch {
        setMahalleler([]);
      }
    },
    [api],
  );

  async function showOnMap() {
    if (!mahalleId || !ada || !parselNo) return;
    setLoading(true);
    setError(null);
    try {
      const feature = await api.getParselGeoJson(Number(mahalleId), ada, parselNo);
      setPreview(feature);
    } catch (e) {
      setError(e instanceof Error ? e.message : "TKGM sorgusu başarısız");
      setPreview(null);
    } finally {
      setLoading(false);
    }
  }

  async function saveParcel() {
    if (!ilId || !ilceId || !mahalleId || !ada || !parselNo) return;
    setLoading(true);
    setError(null);
    try {
      const geometry =
        preview?.geometry?.type === "Polygon"
          ? (preview.geometry as GeoJSON.Polygon)
          : preview?.geometry?.type === "MultiPolygon"
            ? {
                type: "Polygon" as const,
                coordinates: (preview.geometry as GeoJSON.MultiPolygon).coordinates[0],
              }
            : undefined;

      const props = (preview?.properties ?? {}) as TkgmParselProperties;
      const areaFromMeta = preview?.meta?.area_m2 ?? parseTkgmAreaM2(props.alan);

      await api.createParcel({
        label: label || undefined,
        il_id: Number(props.ilId ?? ilId),
        ilce_id: Number(props.ilceId ?? ilceId),
        mahalle_id: Number(props.mahalleId ?? mahalleId),
        ada: String(props.adaNo ?? ada),
        parsel_no: String(props.parselNo ?? parselNo),
        geometry: geometry
          ? {
              type: "Polygon" as const,
              coordinates: geometry.coordinates as [number, number][][],
            }
          : null,
        area_m2: areaFromMeta,
        nitelik: preview?.meta?.nitelik ?? props.nitelik ?? null,
        properties: props,
      });
      router.push("/parcels");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kayıt başarısız");
    } finally {
      setLoading(false);
    }
  }

  const mapGeometry =
    preview?.geometry?.type === "Polygon"
      ? preview.geometry
      : preview?.geometry?.type === "MultiPolygon"
        ? {
            type: "Polygon" as const,
            coordinates: (preview.geometry as GeoJSON.MultiPolygon).coordinates[0],
          }
        : null;

  return (
    <div className="space-y-8 max-w-3xl">
      <PageHeader
        eyebrow="Yeni kayıt"
        title="Parsel ekle"
        description={TKGM_DISCLAIMER}
      />

      {/* Step indicator */}
      <div className="flex gap-2">
        {steps.map((s, i) => (
          <div
            key={s}
            className={`flex-1 rounded-full h-1.5 transition-all duration-500 ${
              i <= stepIndex ? "bg-primary shadow-[0_0_12px_rgba(34,197,94,0.5)]" : "bg-white/10"
            }`}
          />
        ))}
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={defaultTransition}
        className="glass-card glow-border rounded-2xl p-6 md:p-8 space-y-6"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-muted text-xs uppercase tracking-wide">İl</span>
            <select
              className="input-field mt-1.5"
              value={ilId}
              onChange={(e) => {
                const v = Number(e.target.value);
                setIlId(v);
                loadIlceler(v);
              }}
            >
              <option value="">Seçin</option>
              {iller.map((il) => (
                <option key={il.id} value={il.id}>
                  {il.ad}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-muted text-xs uppercase tracking-wide">İlçe</span>
            <select
              className="input-field mt-1.5"
              value={ilceId}
              disabled={!ilceler.length}
              onChange={(e) => {
                const v = Number(e.target.value);
                setIlceId(v);
                loadMahalleler(v);
              }}
            >
              <option value="">Seçin</option>
              {ilceler.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.ad}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-muted text-xs uppercase tracking-wide">Mahalle</span>
            <select
              className="input-field mt-1.5"
              value={mahalleId}
              disabled={!mahalleler.length}
              onChange={(e) => setMahalleId(Number(e.target.value))}
            >
              <option value="">Seçin</option>
              {mahalleler.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.ad}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-muted text-xs uppercase tracking-wide">Etiket</span>
            <input
              className="input-field mt-1.5"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Kuzey tarla"
            />
          </label>
          <label className="block text-sm">
            <span className="text-muted text-xs uppercase tracking-wide">Ada</span>
            <input
              className="input-field mt-1.5"
              value={ada}
              onChange={(e) => setAda(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className="text-muted text-xs uppercase tracking-wide">Parsel</span>
            <input
              className="input-field mt-1.5"
              value={parselNo}
              onChange={(e) => setParselNo(e.target.value)}
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={showOnMap}
            disabled={loading || !mahalleId}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Map className="w-4 h-4" />}
            Haritada göster
          </Button>
          <Button type="button" onClick={saveParcel} disabled={loading || !preview}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Kaydet
          </Button>
        </div>
      </motion.div>

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-red-400 glass-card rounded-xl px-4 py-3 border border-red-500/20"
        >
          {error}
        </motion.p>
      )}

      {preview && (
        <TkgmParcelInfo
          properties={preview.properties as TkgmParselProperties}
          areaM2={preview.meta?.area_m2}
          nitelik={preview.meta?.nitelik}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: preview ? 1 : 0.6, y: 0 }}
        transition={defaultTransition}
        className="map-frame rounded-2xl overflow-hidden"
      >
        <ParcelMap
          geometry={mapGeometry}
          ada={ada}
          parselNo={parselNo}
          className="h-80 md:h-96 w-full"
        />
      </motion.div>
    </div>
  );
}
