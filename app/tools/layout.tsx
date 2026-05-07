import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tools & Aplikasi - Backstagers Jawa Barat",
  description: "Gunakan tools dan aplikasi profesional dari Backstagers untuk membantu merencanakan event Anda dengan lebih baik. Desain stage, budget calculator, schedule planner, dan lebih banyak lagi.",
  keywords: ["tools", "aplikasi", "event planning", "stage design", "budget calculator", "backstagers"],
  openGraph: {
    title: "Tools & Aplikasi - Backstagers Jawa Barat",
    description: "Tools profesional untuk perencanaan event dari Backstagers",
    type: "website",
  },
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
