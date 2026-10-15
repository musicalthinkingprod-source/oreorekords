import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://oreorekords.com"),
  title: "Oreo Rekords — Sello Discográfico en Bogotá",
  description:
    "Sello discográfico independiente en Bogotá, Colombia. A&R, distribución digital, licencias, marketing y gestión de carrera para artistas colombianos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geist.variable}`}>
      <body>{children}</body>
    </html>
  );
}
