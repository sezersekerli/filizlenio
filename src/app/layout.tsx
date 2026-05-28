import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/effects/ScrollProgress";
import { site } from "@/lib/content";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: `${site.title} · ${site.domain}`,
    template: `%s · ${site.domain}`,
  },
  description: `${site.valueProposition} ${site.slogan}`,
  metadataBase: new URL(site.url),
  applicationName: site.domain,
  openGraph: {
    title: site.ogTitle,
    description: site.slogan,
    url: site.url,
    siteName: site.domain,
    locale: "tr_TR",
    type: "website",
    images: [{ url: "/brand/logo.png", width: 1536, height: 1024 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased font-sans">
        <ScrollProgress />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
