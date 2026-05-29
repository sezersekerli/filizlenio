"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { fadeInUp, defaultTransition } from "@/lib/motion";

const interests = [
  "Kurulum / demo",
  "Satış / teklif",
  "Yatırım",
  "Basın",
  "Diğer",
];

const segments = ["Büyük tarla", "Sera", "Kooperatif", "Diğer"];

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-2xl p-10 text-center"
      >
        <p className="text-xl font-semibold text-primary">Teşekkürler!</p>
        <p className="mt-2 text-muted">
          Mesajınız alındı. En kısa sürede sizinle iletişime geçeceğiz.
        </p>
      </motion.div>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-[rgba(34,197,94,0.2)] bg-[rgba(15,23,20,0.6)] px-4 py-3 text-sm text-foreground placeholder:text-muted/60 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30";

  return (
    <motion.form
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={defaultTransition}
      onSubmit={handleSubmit}
      className="glass-card space-y-5 rounded-2xl p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-muted">
            Ad Soyad *
          </label>
          <input id="name" name="name" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="company" className="mb-2 block text-sm font-medium text-muted">
            Kurum
          </label>
          <input id="company" name="company" className={inputClass} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-muted">
            E-posta *
          </label>
          <input id="email" name="email" type="email" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="phone" className="mb-2 block text-sm font-medium text-muted">
            Telefon
          </label>
          <input id="phone" name="phone" type="tel" className={inputClass} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="segment" className="mb-2 block text-sm font-medium text-muted">
            Segment
          </label>
          <select id="segment" name="segment" className={inputClass}>
            {segments.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="interest" className="mb-2 block text-sm font-medium text-muted">
            İlgi alanı *
          </label>
          <select id="interest" name="interest" required className={inputClass}>
            {interests.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-medium text-muted">
          Mesaj *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className={inputClass}
          placeholder="Kurulum, demo, yatırım veya satış hakkında kısaca yazın..."
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-background transition-all hover:bg-[#4ade80] sm:w-auto sm:px-10"
      >
        Gönder
      </button>
    </motion.form>
  );
}
