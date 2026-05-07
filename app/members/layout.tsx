import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar Anggota - Backstagers Jawa Barat",
  description: "Lihat profil lengkap semua anggota Backstagers DPD Jawa Barat. Organisasi profesional event dan entertainment di Jawa Barat.",
  keywords: ["anggota", "backstagers", "jawa barat", "event", "entertainment"],
  openGraph: {
    title: "Daftar Anggota - Backstagers Jawa Barat",
    description: "Profil anggota Backstagers DPD Jawa Barat",
    type: "website",
  },
};

export default function MembersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
