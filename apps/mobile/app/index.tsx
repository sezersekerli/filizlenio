import { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { signInWithGoogle, signOut } from "@/lib/auth";
import { api } from "@/lib/api";
import type { Parcel } from "@filizlen/shared";

export default function HomeScreen() {
  const router = useRouter();
  const [session, setSession] = useState<boolean | null>(null);
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(!!data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(!!s);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    setLoading(true);
    api
      .listParcels()
      .then(setParcels)
      .catch(() => setParcels([]))
      .finally(() => setLoading(false));
  }, [session]);

  if (session === null) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#22c55e" />
      </View>
    );
  }

  if (!session) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Filizlen</Text>
        <Text style={styles.sub}>Parsel yönetimi</Text>
        <Pressable style={styles.btn} onPress={() => signInWithGoogle().catch(console.error)}>
          <Text style={styles.btnText}>Google ile giriş</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Parsellerim</Text>
        <Pressable onPress={() => signOut()}>
          <Text style={styles.link}>Çıkış</Text>
        </Pressable>
      </View>
      {loading ? (
        <ActivityIndicator color="#22c55e" style={{ marginTop: 24 }} />
      ) : (
        <FlatList
          data={parcels}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.sub}>Henüz parsel yok</Text>
          }
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() => router.push(`/parcel/${item.id}`)}
            >
              <Text style={styles.cardTitle}>
                {item.label || `Ada ${item.ada} / ${item.parsel_no}`}
              </Text>
              <Text style={styles.sub}>{item.nitelik ?? "—"}</Text>
            </Pressable>
          )}
        />
      )}
      <Pressable style={styles.btn} onPress={() => router.push("/parcel/new")}>
        <Text style={styles.btnText}>Parsel ekle</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0a120e", padding: 24 },
  container: { flex: 1, backgroundColor: "#0a120e", padding: 16, paddingTop: 48 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  title: { fontSize: 24, fontWeight: "600", color: "#f8fafc" },
  sub: { color: "#64748b", marginTop: 4 },
  link: { color: "#22c55e" },
  btn: { backgroundColor: "#22c55e", padding: 14, borderRadius: 12, alignItems: "center", marginTop: 16 },
  btnText: { color: "#0a120e", fontWeight: "600" },
  card: { backgroundColor: "#0f1a14", padding: 16, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: "rgba(34,197,94,0.2)" },
  cardTitle: { color: "#f8fafc", fontWeight: "500" },
});
