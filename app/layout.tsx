import "./globals.css";
import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = {
  title: "Aktivity OS",
  description: "Sistema operativo interno de Aktivity"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body><AppShell>{children}</AppShell></body>
    </html>
  );
}
