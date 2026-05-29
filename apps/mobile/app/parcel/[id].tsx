import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import MapView, { Polygon } from "react-native-maps";
import { useLocalSearchParams } from "expo-router";
import { api } from "@/lib/api";
import type { Parcel } from "@filizlen/shared";

function parseCoords(geometry: unknown): { latitude: number; longitude: number }[] {
  let geom = geometry;
  if (typeof geom === "string") {
    try {
      geom = JSON.parse(geom);
    } catch {
      return [];
    }
  }
  if (!geom || typeof geom !== "object") return [];
  const g = geom as GeoJSON.Polygon;
  if (g.type !== "Polygon") return [];
  return (g.coordinates[0] ?? []).map(([lng, lat]) => ({
    latitude: lat,
    longitude: lng,
  }));
}

export default function ParcelDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [parcel, setParcel] = useState<Parcel | null>(null);

  useEffect(() => {
    if (!id) return;
    api.getParcel(id).then(setParcel).catch(() => setParcel(null));
  }, [id]);

  if (!parcel) {
    return (
      <View style={styles.center}>
        <Text style={styles.sub}>Yükleniyor…</Text>
      </View>
    );
  }

  const coords = parseCoords(parcel.geometry);
  const region = coords[0]
    ? { ...coords[0], latitudeDelta: 0.01, longitudeDelta: 0.01 }
    : { latitude: 39.9, longitude: 32.8, latitudeDelta: 2, longitudeDelta: 2 };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {parcel.label || `Ada ${parcel.ada} / ${parcel.parsel_no}`}
      </Text>
      <Text style={styles.sub}>{parcel.nitelik ?? "—"}</Text>
      <MapView style={styles.map} region={region}>
        {coords.length > 0 && (
          <Polygon coordinates={coords} strokeColor="#22c55e" fillColor="rgba(34,197,94,0.3)" />
        )}
      </MapView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0a120e" },
  container: { flex: 1, backgroundColor: "#0a120e", padding: 16, paddingTop: 48 },
  title: { fontSize: 22, fontWeight: "600", color: "#f8fafc" },
  sub: { color: "#64748b", marginTop: 4, marginBottom: 12 },
  map: { height: 280, borderRadius: 12 },
});
