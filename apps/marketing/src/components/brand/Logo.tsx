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
      "h-11 w-auto shrink-0 md:h-14 min-w-[190px] max-w-[300px] md:max-w-[340px]",
    variant === "icon" && "h-11 w-11 rounded-xl object-contain md:h-12 md:w-12",
    className,
  );

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="filizlen.io"
      width={variant === "icon" ? 48 : 320}
      height={variant === "icon" ? 48 : 64}
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
      className="inline-flex shrink-0 items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {image}
    </Link>
  );
}
