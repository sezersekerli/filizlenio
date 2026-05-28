"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Logo } from "@/components/brand/Logo";
import { navLinks } from "@/lib/content";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-[rgba(34,197,94,0.15)] bg-[rgba(10,18,14,0.96)] shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
          : "border-b border-transparent bg-[rgba(10,18,14,0.6)]"
      } backdrop-blur-xl`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Logo variant="full" />

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link, i) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <Link
                href={link.href}
                className="text-sm font-medium text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </nav>

        <div className="hidden lg:block">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Button href="/iletisim">Demo ve teklif alın</Button>
          </motion.div>
        </div>

        <button
          type="button"
          className="text-foreground lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-[rgba(34,197,94,0.1)] bg-[var(--background-elevated)] lg:hidden"
          >
            <nav className="flex flex-col gap-4 px-6 py-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="text-base font-medium text-muted hover:text-foreground"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <Button href="/iletisim" className="w-full text-center">
                Demo ve teklif alın
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
