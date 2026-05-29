"use client";

import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Polygon, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";

function FitBounds({ positions }: { positions: LatLngExpression[] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      map.fitBounds(positions as [number, number][]);
    }
  }, [map, positions]);
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

export function ParcelMap({
  geometry,
  className = "h-64 w-full rounded-xl overflow-hidden border border-[var(--card-border)]",
}: {
  geometry?: GeoJSON.Polygon | GeoJSON.MultiPolygon | null;
  className?: string;
}) {
  const positions = geoJsonToLatLng(geometry);
  const center: LatLngExpression =
    positions[0] ?? ([39.0, 35.0] as LatLngExpression);

  return (
    <div className={className}>
      <MapContainer
        center={center}
        zoom={positions.length ? 15 : 6}
        className="h-full w-full"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {positions.length > 0 && (
          <>
            <Polygon positions={positions} pathOptions={{ color: "#22c55e" }} />
            <FitBounds positions={positions} />
          </>
        )}
      </MapContainer>
    </div>
  );
}
