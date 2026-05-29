import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { navLinks, site } from "@/lib/content";

export function Footer() {
  return (
    <footer className="border-t border-[rgba(34,197,94,0.1)] bg-[var(--primary-dark)]">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-3">
        <div>
          <div className="mb-4">
            <Logo variant="full" />
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-muted">
            {site.slogan} {site.valueProposition}
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">
            Sayfalar
          </h3>
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">
            İletişim
          </h3>
          <p className="text-sm text-muted">
            <a
              href={`mailto:${site.email}`}
              className="transition-colors hover:text-foreground"
            >
              {site.email}
            </a>
          </p>
          <p className="mt-4 text-sm text-muted">Türkiye</p>
        </div>
      </div>

      <div className="border-t border-[rgba(34,197,94,0.08)] px-6 py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-xs text-muted sm:flex-row">
          <span>© {new Date().getFullYear()} {site.domain}. Tüm hakları saklıdır.</span>
          <Link href="/gizlilik" className="hover:text-foreground">
            Gizlilik ve KVKK
          </Link>
        </div>
      </div>
    </footer>
  );
}
