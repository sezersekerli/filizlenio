import { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { fetchCurrentUser, loginUser, logoutUser, registerUser } from "@/lib/auth";
import { api } from "@/lib/api";
import type { Parcel } from "@filizlen/shared";

export default function HomeScreen() {
  const router = useRouter();
  const [session, setSession] = useState<boolean | null>(null);
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    fetchCurrentUser()
      .then((user) => setSession(!!user))
      .catch(() => setSession(false));
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

  async function handleAuth() {
    if (!email.trim() || !password) return;
    setAuthError(null);
    setAuthLoading(true);
    try {
      if (authMode === "signup") {
        await registerUser({ email: email.trim(), password });
      } else {
        await loginUser({ email: email.trim(), password });
      }
      setSession(true);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Giriş başarısız");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleSignOut() {
    await logoutUser();
    setSession(false);
    setParcels([]);
  }

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

        <View style={styles.authTabs}>
          <Pressable
            style={[styles.authTab, authMode === "signin" && styles.authTabActive]}
            onPress={() => setAuthMode("signin")}
          >
            <Text style={styles.authTabText}>Giriş</Text>
          </Pressable>
          <Pressable
            style={[styles.authTab, authMode === "signup" && styles.authTabActive]}
            onPress={() => setAuthMode("signup")}
          >
            <Text style={styles.authTabText}>Kayıt</Text>
          </Pressable>
        </View>

        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="E-posta"
          placeholderTextColor="#64748b"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Şifre"
          placeholderTextColor="#64748b"
          secureTextEntry
        />

        {authError ? <Text style={styles.error}>{authError}</Text> : null}

        <Pressable
          style={[styles.btn, authLoading && styles.btnDisabled]}
          onPress={handleAuth}
          disabled={authLoading}
        >
          <Text style={styles.btnText}>
            {authLoading ? "..." : authMode === "signup" ? "Kayıt ol" : "Giriş yap"}
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Parsellerim</Text>
        <Pressable onPress={handleSignOut}>
          <Text style={styles.link}>Çıkış</Text>
        </Pressable>
      </View>
      {loading ? (
        <ActivityIndicator color="#22c55e" style={{ marginTop: 24 }} />
      ) : (
        <FlatList
          data={parcels}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.sub}>Henüz parsel yok</Text>}
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a120e",
    padding: 24,
  },
  container: { flex: 1, backgroundColor: "#0a120e", padding: 16, paddingTop: 48 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: { fontSize: 24, fontWeight: "600", color: "#f8fafc" },
  sub: { color: "#64748b", marginTop: 4 },
  link: { color: "#22c55e" },
  authTabs: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 12,
    backgroundColor: "#0f1a14",
    borderRadius: 12,
    padding: 4,
    width: "100%",
    maxWidth: 320,
  },
  authTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  authTabActive: { backgroundColor: "#22c55e" },
  authTabText: { color: "#f8fafc", fontWeight: "600", fontSize: 13 },
  input: {
    width: "100%",
    maxWidth: 320,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.25)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#f8fafc",
    backgroundColor: "#0f1a14",
  },
  error: { color: "#fca5a5", marginTop: 10, fontSize: 13, textAlign: "center" },
  btn: {
    backgroundColor: "#22c55e",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
    width: "100%",
    maxWidth: 320,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: "#0a120e", fontWeight: "600" },
  card: {
    backgroundColor: "#0f1a14",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.2)",
  },
  cardTitle: { color: "#f8fafc", fontWeight: "500" },
});
