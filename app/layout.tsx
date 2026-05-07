import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-context";
import { getStructuredData } from "@/lib/structured-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Backstagers - Jawa Barat | Organisasi Event & Entertainment Profesional",
  description: "Backstagers DPD Jawa Barat adalah organisasi profesional yang menyediakan layanan event management, entertainment, dan produksi berkualitas tinggi untuk acara Anda.",
  keywords: ["event", "entertainment", "backstagers", "jawa barat", "event management", "produksi", "acara"],
  authors: [{ name: "Backstagers DPD Jawa Barat" }],
  openGraph: {
    title: "Backstagers - Jawa Barat",
    description: "Organisasi Profesional Event & Entertainment",
    type: "website",
    locale: "id_ID",
    url: "https://backstagers-jawabarat.vercel.app",
    siteName: "Backstagers DPD Jawa Barat",
    images: [
      {
        url: "/logo_backstagers_jawabarat.png",
        width: 1200,
        height: 630,
        alt: "Backstagers DPD Jawa Barat Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Backstagers - Jawa Barat",
    description: "Organisasi Profesional Event & Entertainment",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE", // Add your own verification code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = getStructuredData();

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
