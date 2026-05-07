import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Struktur Organisasi - Backstagers Jawa Barat",
  description: "Lihat struktur organisasi lengkap Backstagers DPD Jawa Barat dengan informasi tim kepemimpinan dan departemen.",
  keywords: ["struktur", "organisasi", "tim", "backstagers", "jawa barat"],
  openGraph: {
    title: "Struktur Organisasi - Backstagers Jawa Barat",
    description: "Struktur organisasi Backstagers DPD Jawa Barat",
    type: "website",
  },
};

export default function StructureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
