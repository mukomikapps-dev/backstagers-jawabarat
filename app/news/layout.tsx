import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Berita & Artikel - Backstagers Jawa Barat",
  description: "Baca berita terbaru, artikel, dan update dari Backstagers DPD Jawa Barat tentang dunia event, entertainment, dan produksi.",
  keywords: ["berita", "artikel", "backstagers", "jawa barat", "event", "entertainment", "blog"],
  openGraph: {
    title: "Berita & Artikel - Backstagers Jawa Barat",
    description: "Berita dan artikel terbaru dari Backstagers DPD Jawa Barat",
    type: "website",
  },
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
