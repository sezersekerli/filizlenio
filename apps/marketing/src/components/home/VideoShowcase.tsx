"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useDesktopVideo } from "@/hooks/useDesktopVideo";
import { blurIn, defaultTransition } from "@/lib/motion";

const POSTER =
  "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=1920&q=80";
const SCENES = [
  { src: "/videos/corn-sensor-loop.mp4" },
  { src: "/videos/wheat-drone.mp4" },
  { src: "/videos/sunflower-drone.mp4" },
];

function MediaFrame({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={blurIn}
      transition={defaultTransition}
      className="relative overflow-hidden rounded-3xl border border-primary/25 shadow-[0_0_100px_rgba(34,197,94,0.2)]"
    >
      {children}
      <div className="absolute inset-0 bg-gradient-to-t from-[#060b08] via-transparent to-[#060b08]/40" />
    </motion.div>
  );
}

function MobilePoster() {
  return (
    <MediaFrame>
      <div className="relative aspect-video w-full">
        <Image
          src={POSTER}
          alt="Tarlada akıllı sulama ve sensör izleme"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 1152px"
        />
      </div>
      <p className="absolute bottom-4 left-4 right-4 text-center text-xs text-muted/90">
        Video önizlemesi masaüstü tarayıcıda
      </p>
    </MediaFrame>
  );
}

function DesktopVideoPlayer() {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [sceneIndex, setSceneIndex] = useState(0);
  const activeScene = SCENES[sceneIndex];

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.5, 1, 1, 0.6]);

  function togglePlay() {
    const v = videoRef.current;
    const a = audioRef.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
      if (a && !muted) {
        a.currentTime = v.currentTime % (a.duration || 1);
        void a.play();
      }
      setPlaying(true);
    } else {
      v.pause();
      if (a) a.pause();
      setPlaying(false);
    }
  }

  function toggleMute() {
    const v = videoRef.current;
    const a = audioRef.current;
    if (!v) return;
    const nextMuted = !v.muted;
    v.muted = nextMuted;
    setMuted(nextMuted);

    if (!a) return;
    if (nextMuted) {
      a.pause();
      return;
    }

    a.volume = 0.38;
    a.currentTime = v.currentTime % (a.duration || 1);
    void a.play();
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setSceneIndex((prev) => (prev + 1) % SCENES.length);
    }, 7800);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    const a = audioRef.current;
    if (!v) return;

    v.currentTime = 0;
    if (playing) void v.play();

    if (a && !muted) {
      a.currentTime = 0;
      void a.play();
    }
  }, [sceneIndex, playing, muted]);

  return (
    <div ref={ref}>
      <motion.div style={{ y, scale, opacity }} className="relative mt-12">
        <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-primary/30 via-accent/20 to-primary/30 blur-2xl" />
        <MediaFrame>
          <AnimatePresence mode="wait">
            <motion.video
              key={activeScene.src}
              ref={videoRef}
              className="aspect-video w-full object-cover"
              src={activeScene.src}
              poster={POSTER}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              initial={{ opacity: 0.12, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.08, scale: 1.01 }}
              transition={{ duration: 1.05, ease: "easeInOut" }}
            />
          </AnimatePresence>
          <audio ref={audioRef} src="/videos/filizlen-drive.mp3" loop preload="metadata" />

          <div className="absolute bottom-0 left-0 right-0 flex flex-wrap items-end justify-between gap-4 p-6 md:p-8">
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
        </MediaFrame>
      </motion.div>
    </div>
  );
}

export function VideoShowcase() {
  const showVideo = useDesktopVideo();

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.08),transparent_70%)]" />

      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Sahada"
          title="Tarladan buluta, buluttan kontrole"
          description="Mısır, buğday, ayçiçeği ve diğer tarım alanlarından gelen görüntüler — filizlen.io ile sahadaki veri aynı akışta yönetilir."
        />

        {showVideo ? (
          <DesktopVideoPlayer />
        ) : (
          <div className="relative mt-12">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-primary/30 via-accent/20 to-primary/30 blur-2xl opacity-60" />
            <MobilePoster />
          </div>
        )}
      </div>
    </section>
  );
}
