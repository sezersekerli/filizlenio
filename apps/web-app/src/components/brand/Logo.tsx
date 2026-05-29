"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";

type LogoVariant = "full" | "icon";

type LogoProps = {
  variant?: LogoVariant;
  className?: string;
  href?: string | null;
};

const ASSETS = {
  icon: { png: "/brand/logo-icon.png", svg: "/brand/logo-icon.svg" },
  full: { png: "/brand/logo-navbar.png", svg: "/brand/logo.svg" },
} as const;

function LogoImage({
  variant,
  className,
}: {
  variant: LogoVariant;
  className?: string;
}) {
  const assets = ASSETS[variant];
  const [src, setSrc] = useState<string>(assets.png);

  const imgClass = cn(
    variant === "full" &&
      "h-10 w-auto shrink-0 sm:h-11 md:h-12 min-w-[160px] max-w-[280px]",
    variant === "icon" && "h-14 w-14 rounded-2xl object-contain sm:h-16 sm:w-16",
    className,
  );

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="filizlen.io"
      width={variant === "icon" ? 64 : 280}
      height={variant === "icon" ? 64 : 48}
      className={imgClass}
      onError={() => {
        if (src !== assets.svg) setSrc(assets.svg);
      }}
    />
  );
}

export function Logo({ variant = "full", className, href = "/" }: LogoProps) {
  const image = <LogoImage variant={variant} className={className} />;

  if (href === null) return image;

  return (
    <Link
      href={href}
      className="inline-flex shrink-0 items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
    >
      {image}
    </Link>
  );
}
