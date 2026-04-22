import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "StudyLogger — YKS Çalışma Takip",
  description: "YKS öğrencileri için çalışma takip ve arkadaş karşılaştırma platformu",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/icon-192.png",
    apple: "/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "StudyLogger",
  },
};

export const viewport: Viewport = {
  themeColor: "#6366f1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground pb-16 md:pb-0">
        {/* ─── Global Blue Ambient Background ─────────────────── */}
        <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
          {/* Base deep blue radial */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 90% 60% at 50% 0%, oklch(0.18 0.030 265 / 0.65) 0%, transparent 70%)",
            }}
          />
          {/* Orb 1 — top left */}
          <div
            className="absolute rounded-full glow-orb"
            style={{
              top: "10%",
              left: "15%",
              width: 420,
              height: 420,
              background:
                "radial-gradient(circle, oklch(0.60 0.12 265 / 0.10) 0%, transparent 70%)",
              filter: "blur(60px)",
              animationDuration: "8s, 4s",
            }}
          />
          {/* Orb 2 — bottom right */}
          <div
            className="absolute rounded-full glow-orb"
            style={{
              top: "60%",
              right: "10%",
              width: 520,
              height: 520,
              background:
                "radial-gradient(circle, oklch(0.58 0.10 230 / 0.08) 0%, transparent 70%)",
              filter: "blur(80px)",
              animationDelay: "3.6s",
              animationDuration: "12s, 4s",
            }}
          />
          {/* Orb 3 — bottom left */}
          <div
            className="absolute rounded-full glow-orb"
            style={{
              bottom: "15%",
              left: "20%",
              width: 380,
              height: 380,
              background:
                "radial-gradient(circle, oklch(0.62 0.14 280 / 0.07) 0%, transparent 70%)",
              filter: "blur(55px)",
              animationDelay: "1.8s",
              animationDuration: "10s, 4s",
            }}
          />
          {/* Orb 4 — top right */}
          <div
            className="absolute rounded-full glow-orb"
            style={{
              top: "20%",
              right: "20%",
              width: 340,
              height: 340,
              background:
                "radial-gradient(circle, oklch(0.60 0.15 270 / 0.09) 0%, transparent 70%)",
              filter: "blur(55px)",
              animationDelay: "5.4s",
              animationDuration: "9s, 4s",
            }}
          />
          {/* Orb 5 — center right */}
          <div
            className="absolute rounded-full glow-orb"
            style={{
              bottom: "30%",
              left: "60%",
              width: 300,
              height: 300,
              background:
                "radial-gradient(circle, oklch(0.58 0.13 255 / 0.06) 0%, transparent 70%)",
              filter: "blur(65px)",
              animationDelay: "7.2s",
              animationDuration: "11s, 4s",
            }}
          />
          {/* Orb 6 — center left */}
          <div
            className="absolute rounded-full glow-orb"
            style={{
              top: "50%",
              left: "5%",
              width: 260,
              height: 260,
              background:
                "radial-gradient(circle, oklch(0.60 0.11 240 / 0.07) 0%, transparent 70%)",
              filter: "blur(48px)",
              animationDelay: "2.7s",
              animationDuration: "14s, 4s",
            }}
          />
        </div>
        {children}
        <Toaster richColors position="top-right" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
