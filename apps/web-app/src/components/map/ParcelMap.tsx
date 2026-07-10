"use client";

import L from "leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Polygon, TileLayer, useMap } from "react-leaflet";
import { useEffect, useMemo, useState } from "react";

const SATELLITE_LAYERS = {
  imagery: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "Tiles &copy; Esri &mdash; Maxar, Earthstar, USDA, USGS, IGN, GIS User Community",
    maxZoom: 19,
  },
  roads: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}",
    attribution: "",
    maxZoom: 19,
  },
  labels: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
    attribution: "",
    maxZoom: 19,
  },
} as const;

function FitBounds({
  boundsKey,
  positions,
}: {
  boundsKey: string;
  positions: LatLngExpression[];
}) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      map.fitBounds(positions as [number, number][], { padding: [28, 28] });
    }
  }, [map, boundsKey]);
  return null;
}

function geoJsonToLatLng(
  geometry: GeoJSON.Polygon | GeoJSON.MultiPolygon | null | undefined,
): LatLngExpression[] {
  if (!geometry) return [];
  const ring =
    geometry.type === "Polygon"
      ? geometry.coordinates[0]
      : geometry.coordinates[0]?.[0];
  if (!ring) return [];
  return ring.map(([lng, lat]) => [lat, lng] as LatLngExpression);
}

function polygonCentroid(positions: LatLngExpression[]): LatLngExpression {
  let lat = 0;
  let lng = 0;
  for (const p of positions) {
    const [la, ln] = p as [number, number];
    lat += la;
    lng += ln;
  }
  return [lat / positions.length, lng / positions.length];
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function ParcelLabel({
  position,
  text,
}: {
  position: LatLngExpression;
  text: string;
}) {
  const icon = useMemo(
    () =>
      L.divIcon({
        className: "parcel-map-label",
        html: `<span>${escapeHtml(text)}</span>`,
        iconSize: [160, 28],
        iconAnchor: [80, 14],
      }),
    [text],
  );

  return <Marker position={position} icon={icon} interactive={false} />;
}

export function ParcelMap({
  geometry,
  ada,
  parselNo,
  className = "h-64 w-full rounded-xl overflow-hidden border border-[var(--card-border)]",
  variant = "full",
}: {
  geometry?: GeoJSON.Polygon | GeoJSON.MultiPolygon | null;
  ada?: string | number | null;
  parselNo?: string | number | null;
  className?: string;
  /** lite = tek uydu katmanı, mobil için daha hafif */
  variant?: "full" | "lite";
}) {
  const [touchDevice, setTouchDevice] = useState(false);

  useEffect(() => {
    setTouchDevice(
      window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768,
    );
  }, []);

  const boundsKey = useMemo(
    () => (geometry ? JSON.stringify(geometry) : ""),
    [geometry],
  );
  const positions = useMemo(() => geoJsonToLatLng(geometry), [boundsKey]);
  const center: LatLngExpression =
    positions[0] ?? ([39.0, 35.0] as LatLngExpression);
  const labelText =
    ada != null && parselNo != null && String(ada) !== "" && String(parselNo) !== ""
      ? `Ada ${ada} / Parsel ${parselNo}`
      : null;
  const labelPosition = positions.length > 0 ? polygonCentroid(positions) : null;
  const showOverlays = variant === "full" && !touchDevice;

  return (
    <div className={className}>
      <MapContainer
        center={center}
        zoom={positions.length ? 16 : 6}
        className="h-full w-full"
        scrollWheelZoom={!touchDevice}
        dragging
        touchZoom
        maxZoom={19}
      >
        <TileLayer
          attribution={SATELLITE_LAYERS.imagery.attribution}
          url={SATELLITE_LAYERS.imagery.url}
          maxZoom={SATELLITE_LAYERS.imagery.maxZoom}
        />
        {showOverlays && (
          <>
            <TileLayer
              url={SATELLITE_LAYERS.roads.url}
              maxZoom={SATELLITE_LAYERS.roads.maxZoom}
              opacity={0.9}
            />
            <TileLayer
              url={SATELLITE_LAYERS.labels.url}
              maxZoom={SATELLITE_LAYERS.labels.maxZoom}
            />
          </>
        )}
        {positions.length > 0 && (
          <>
            <Polygon
              positions={positions}
              pathOptions={{
                color: "#22c55e",
                weight: 3,
                fillColor: "#22c55e",
                fillOpacity: 0.12,
              }}
            />
            {labelText && labelPosition && (
              <ParcelLabel position={labelPosition} text={labelText} />
            )}
            <FitBounds boundsKey={boundsKey} positions={positions} />
          </>
        )}
      </MapContainer>
    </div>
  );
}
