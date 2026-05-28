"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { blurIn, defaultTransition } from "@/lib/motion";

const VIDEO_SRC =
  "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-crop-field-4232-large.mp4";
const POSTER =
  "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80";

export function VideoShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.5, 1, 1, 0.6]);

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  }

  function toggleMute() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }

  return (
    <section ref={ref} className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.08),transparent_70%)]" />

      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Sahada"
          title="Tarımı havadan, veriyi yerden"
          description="Akıllı sulama ve dijital tarım — görsel olarak da hissettirin. Filizlen sahada nasıl çalışır?"
        />

        <motion.div style={{ y, scale, opacity }} className="relative mt-12">
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-primary/30 via-accent/20 to-primary/30 blur-2xl" />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={blurIn}
            transition={defaultTransition}
            className="relative overflow-hidden rounded-3xl border border-primary/25 shadow-[0_0_100px_rgba(34,197,94,0.2)]"
          >
            <video
              ref={videoRef}
              className="aspect-video w-full object-cover"
              src={VIDEO_SRC}
              poster={POSTER}
              autoPlay
              muted
              loop
              playsInline
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#060b08] via-transparent to-[#060b08]/40" />

            <div className="absolute bottom-0 left-0 right-0 flex flex-wrap items-end justify-between gap-4 p-6 md:p-8">
              <div>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="text-sm font-semibold uppercase tracking-widest text-primary"
                >
                  Filizlen · Tarım 5.0
                </motion.p>
                <p className="mt-1 max-w-md text-lg font-medium text-foreground md:text-xl">
                  Veri analitiği ile sulamayı optimize edin
                </p>
              </div>

              <div className="flex gap-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={togglePlay}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-background shadow-[0_0_40px_rgba(34,197,94,0.5)]"
                  aria-label={playing ? "Duraklat" : "Oynat"}
                >
                  {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleMute}
                  className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/40 bg-black/40 text-foreground backdrop-blur-md"
                  aria-label={muted ? "Sesi aç" : "Sessiz"}
                >
                  {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
