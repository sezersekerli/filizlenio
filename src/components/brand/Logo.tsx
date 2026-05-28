import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoVariant = "full" | "icon";

type LogoProps = {
  variant?: LogoVariant;
  className?: string;
  href?: string | null;
};

export function Logo({ variant = "full", className, href = "/" }: LogoProps) {
  const imgClass = cn(
    variant === "full" &&
      "h-11 w-auto shrink-0 md:h-14 min-w-[190px] max-w-[300px] md:max-w-[340px]",
    variant === "icon" && "h-11 w-11 rounded-xl object-contain md:h-12 md:w-12",
    className,
  );

  const image =
    variant === "icon" ? (
      <img
        src="/brand/logo-icon.png"
        alt="filizlen.io"
        width={48}
        height={48}
        className={imgClass}
      />
    ) : (
      <img
        src="/brand/logo-navbar.png"
        alt="filizlen.io"
        width={320}
        height={64}
        className={imgClass}
      />
    );

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
