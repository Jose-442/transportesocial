import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import { CookieBanner } from "@/components/legal/CookieBanner";
import { AddToHomeScreenBanner } from "@/components/pwa/AddToHomeScreenBanner";
import { APP_NAME } from "@/lib/constants";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s · ${APP_NAME}`,
  },
  description:
    "Portes y gastos compartidos entre particulares. Publica rutas o envía bultos con conductores de confianza.",
  icons: {
    icon: "/brand/icon-192.png",
    apple: "/brand/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: APP_NAME,
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#047857",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} h-full`}>
      <body className="min-h-dvh antialiased">
        <AppShell>{children}</AppShell>
        <AddToHomeScreenBanner />
        <CookieBanner />
      </body>
    </html>
  );
}
