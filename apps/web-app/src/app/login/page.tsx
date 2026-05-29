"use client";

import { Logo } from "@/components/brand/Logo";
import { AppBackground } from "@/components/effects/AppBackground";
import { loginUser, registerUser } from "@/lib/auth/client";
import { blurIn, defaultTransition, fadeInUp, scaleIn } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Sparkles,
  Sprout,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const features = [
  { icon: MapPin, text: "Ada/parsel ile haritada tarla" },
  { icon: Sprout, text: "Manuel ekim & sulama takibi" },
  { icon: Sparkles, text: "Sense · Cloud · Control hazır" },
] as const;

type AuthMode = "signin" | "signup";

function formatAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("e-posta veya şifre")) return message;
  if (m.includes("zaten kayıtlı")) return message;
  return message;
}

function AuthField({
  id,
  label,
  icon: Icon,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon: typeof Mail;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-xs font-medium text-muted/90 pl-0.5">
        {label}
      </label>
      <div className="input-group">
        <span className="input-group-icon" aria-hidden>
          <Icon className="w-[18px] h-[18px]" />
        </span>
        <input id={id} className="input-group-field" {...props} />
      </div>
    </div>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/dashboard";
  const urlError = searchParams.get("error");

  const [authError, setAuthError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<AuthMode>("signin");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (urlError === "auth") {
      setAuthError("Oturum açılamadı. Lütfen tekrar deneyin.");
    }
  }, [urlError]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setAuthError(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        await registerUser({ email: email.trim(), password });
      } else {
        await loginUser({ email: email.trim(), password });
      }
      window.location.href = redirectTo;
    } catch (err) {
      setAuthError(
        formatAuthError(err instanceof Error ? err.message : "Giriş başarısız"),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative flex flex-col lg:flex-row">
      <AppBackground />

      {/* Sol — marka */}
      <motion.aside
        initial="hidden"
        animate="visible"
        variants={blurIn}
        transition={defaultTransition}
        className="relative z-10 flex flex-col justify-center px-6 py-12 lg:w-1/2 lg:min-h-screen lg:px-16 xl:px-20 lg:border-r lg:border-white/5"
      >
        <Logo variant="full" href="https://filizlen.io" className="mb-12 lg:mb-16" />

        <h1 className="text-3xl sm:text-4xl xl:text-[2.75rem] font-bold text-gradient leading-tight max-w-lg">
          Tarlan cebinde
        </h1>
        <p className="text-muted mt-4 text-sm sm:text-base max-w-md leading-relaxed">
          Parsellerini haritada gör, ekim ve sulamayı kaydet. Sensör paketine geçince aynı hesap
          devam eder.
        </p>

        <ul className="mt-10 hidden lg:flex flex-col gap-4 max-w-md">
          {features.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3.5 text-sm text-muted">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="w-4 h-4" />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </motion.aside>

      {/* Sağ — giriş */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-10 sm:px-10 lg:px-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={scaleIn}
          transition={{ ...defaultTransition, delay: 0.08 }}
          className="w-full max-w-[420px]"
        >
          <div className="glass-card glow-border rounded-3xl p-8 sm:p-10">
            <div className="flex justify-center mb-7">
              <Logo variant="icon" href={null} className="h-11 w-11 sm:h-12 sm:w-12" />
            </div>

            <div className="mb-7 text-center">
              <h2 className="text-2xl font-semibold tracking-tight">
                {mode === "signup" ? "Hesap oluştur" : "Giriş yap"}
              </h2>
              <p className="text-sm text-muted mt-1.5 max-w-[280px] mx-auto leading-relaxed">
                {mode === "signup"
                  ? "Ücretsiz kayıt ol, ilk parselini ekle."
                  : "Hesabına giriş yap ve tarlalarını yönet."}
              </p>
            </div>

            <div
              className="mb-7 flex rounded-xl bg-black/35 p-1 border border-white/[0.06]"
              role="tablist"
            >
              {(["signin", "signup"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={mode === tab}
                      onClick={() => {
                        setMode(tab);
                        setAuthError(null);
                      }}
                  className={cn(
                    "flex-1 rounded-lg py-2.5 text-sm font-medium transition-all duration-200",
                    mode === tab
                      ? "bg-primary text-[#052e16] shadow-sm"
                      : "text-muted hover:text-foreground",
                  )}
                >
                  {tab === "signin" ? "Giriş" : "Kayıt ol"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <AuthField
                id="email"
                label="E-posta"
                icon={Mail}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@email.com"
                autoComplete="email"
                required
                disabled={loading}
              />

              <AuthField
                id="password"
                label="Şifre"
                icon={Lock}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "signup" ? "En az 6 karakter" : "••••••••"}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                required
                disabled={loading}
                minLength={6}
              />

              {authError && (
                <p
                  role="alert"
                  className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-3.5 py-2.5"
                >
                  {authError}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !email.trim() || !password}
                className="btn-glow w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-[#052e16] font-semibold hover:brightness-110 disabled:opacity-50 transition-all"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {mode === "signup" ? "Kayıt ol" : "Giriş yap"}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-[11px] text-muted/90 leading-relaxed px-2">
              Devam ederek{" "}
              <Link href="https://filizlen.io/gizlilik" className="text-primary hover:underline">
                gizlilik politikasını
              </Link>{" "}
              kabul etmiş olursunuz.
            </p>
          </div>

          <motion.ul
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } } }}
            className="mt-6 grid gap-2 sm:grid-cols-3 lg:hidden"
          >
            {features.map(({ icon: Icon, text }) => (
              <motion.li
                key={text}
                variants={fadeInUp}
                transition={defaultTransition}
                className="glass-card rounded-xl px-3 py-2.5 text-center text-[10px] text-muted"
              >
                <Icon className="w-3.5 h-3.5 text-primary mx-auto mb-1" />
                {text}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </div>
  );
}

function LoginPageFallback() {
  return (
    <div className="min-h-screen relative flex flex-col lg:flex-row hero-gradient">
      <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" aria-hidden />
      <aside className="relative z-10 flex flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16 lg:border-r lg:border-white/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logo-navbar.png" alt="filizlen.io" className="h-10 w-auto mb-12" />
        <h1 className="text-3xl sm:text-4xl font-bold text-gradient max-w-lg">Tarlan cebinde</h1>
        <p className="text-muted mt-4 text-sm max-w-md">Parsellerini haritada gör, kayıt tut.</p>
      </aside>
      <div className="relative z-10 flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-[420px] glass-card glow-border rounded-3xl p-8 space-y-5">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-2xl bg-primary/20 animate-pulse" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold">Giriş yap</h2>
            <div className="h-3 w-48 mx-auto rounded bg-black/30 animate-pulse" />
          </div>
          <div className="h-11 rounded-xl bg-black/30 animate-pulse" />
          <div className="h-[4.5rem] rounded-xl bg-black/30 animate-pulse" />
          <div className="h-[4.5rem] rounded-xl bg-black/30 animate-pulse" />
          <div className="h-12 rounded-xl bg-primary/30 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginForm />
    </Suspense>
  );
}
