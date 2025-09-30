import Providers from "@/components/providers";
import type { Metadata } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import { ReactNode } from "react";
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
  title: "Koalla",
  description: "TODO",
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
          <div className="bg-brand-desert-50">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
