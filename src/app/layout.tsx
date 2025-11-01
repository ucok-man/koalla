import Providers from "@/components/providers";
import type { Metadata } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  weight: ["400"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "Koalla - Custom Phone Cases for Your Memories",
    template: "%s | Koalla",
  },
  description:
    "Turn your precious memories into beautiful custom phone cases. High-quality, durable cases with 5-year print warranty. Wireless charging compatible with scratch-resistant coating.",
  keywords: [
    "custom phone case",
    "personalized phone case",
    "photo phone case",
    "iPhone case",
    "custom iPhone case",
    "memory phone case",
    "durable phone case",
    "wireless charging case",
  ],
  authors: [{ name: "ucokman" }],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${instrumentSerif.variable} antialiased font-sans`}
      >
        <Providers>
          <div className="bg-brand-desert-50">
            {children}
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  );
}
