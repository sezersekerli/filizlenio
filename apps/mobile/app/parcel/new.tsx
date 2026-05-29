import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import MapView, { Polygon } from "react-native-maps";
import { useRouter } from "expo-router";
import { api } from "@/lib/api";
import { ILLER } from "@/lib/iller";

export default function NewParcelScreen() {
  const router = useRouter();
  const [ilId, setIlId] = useState("6");
  const [ilceId, setIlceId] = useState("");
  const [mahalleId, setMahalleId] = useState("");
  const [ada, setAda] = useState("");
  const [parselNo, setParselNo] = useState("");
  const [coords, setCoords] = useState<{ latitude: number; longitude: number }[]>([]);

  async function preview() {
    if (!mahalleId || !ada || !parselNo) return;
    try {
      const feature = await api.getParselGeoJson(Number(mahalleId), ada, parselNo);
      const geom = feature.geometry;
      if (geom?.type === "Polygon") {
        const ring = geom.coordinates[0];
        setCoords(ring.map(([lng, lat]) => ({ latitude: lat, longitude: lng })));
      }
    } catch (e) {
      Alert.alert("Hata", e instanceof Error ? e.message : "TKGM hatası");
    }
  }

  async function save() {
    try {
      await api.createParcel({
        il_id: Number(ilId),
        ilce_id: Number(ilceId),
        mahalle_id: Number(mahalleId),
        ada,
        parsel_no: parselNo,
        geometry:
          coords.length > 0
            ? {
                type: "Polygon",
                coordinates: [coords.map((c) => [c.longitude, c.latitude])],
              }
            : null,
      });
      router.back();
    } catch (e) {
      Alert.alert("Hata", e instanceof Error ? e.message : "Kayıt hatası");
    }
  }

  const region =
    coords.length > 0
      ? {
          latitude: coords[0].latitude,
          longitude: coords[0].longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }
      : { latitude: 39.9, longitude: 32.8, latitudeDelta: 2, longitudeDelta: 2 };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Parsel ekle</Text>
      <Text style={styles.hint}>İl (örnek): {ILLER.find((i) => i.id === Number(ilId))?.ad}</Text>
      <TextInput style={styles.input} placeholder="İl ID" value={ilId} onChangeText={setIlId} placeholderTextColor="#64748b" />
      <TextInput style={styles.input} placeholder="İlçe ID" value={ilceId} onChangeText={setIlceId} placeholderTextColor="#64748b" />
      <TextInput style={styles.input} placeholder="Mahalle ID" value={mahalleId} onChangeText={setMahalleId} placeholderTextColor="#64748b" />
      <TextInput style={styles.input} placeholder="Ada" value={ada} onChangeText={setAda} placeholderTextColor="#64748b" />
      <TextInput style={styles.input} placeholder="Parsel" value={parselNo} onChangeText={setParselNo} placeholderTextColor="#64748b" />
      <Pressable style={styles.btnOutline} onPress={preview}>
        <Text style={styles.btnOutlineText}>Haritada göster</Text>
      </Pressable>
      <MapView style={styles.map} region={region}>
        {coords.length > 0 && (
          <Polygon coordinates={coords} strokeColor="#22c55e" fillColor="rgba(34,197,94,0.3)" />
        )}
      </MapView>
      <Pressable style={styles.btn} onPress={save}>
        <Text style={styles.btnText}>Kaydet</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a120e", padding: 16, paddingTop: 48 },
  title: { fontSize: 22, fontWeight: "600", color: "#f8fafc", marginBottom: 12 },
  hint: { color: "#64748b", marginBottom: 8, fontSize: 12 },
  input: { backgroundColor: "#0f1a14", borderWidth: 1, borderColor: "rgba(34,197,94,0.2)", borderRadius: 10, padding: 12, color: "#f8fafc", marginBottom: 8 },
  map: { height: 240, borderRadius: 12, marginVertical: 12 },
  btn: { backgroundColor: "#22c55e", padding: 14, borderRadius: 12, alignItems: "center", marginBottom: 32 },
  btnText: { color: "#0a120e", fontWeight: "600" },
  btnOutline: { borderWidth: 1, borderColor: "#22c55e", padding: 12, borderRadius: 12, alignItems: "center", marginBottom: 8 },
  btnOutlineText: { color: "#22c55e" },
});
