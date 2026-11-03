import type { Metadata, Viewport } from "next";
import "@fontsource-variable/archivo/wdth.css";
import "./globals.css";
import { Medicao } from "@/components/Medicao";

export const metadata: Metadata = {
  metadataBase: new URL("https://pronto-pra-temporada.vercel.app"),
  title: "Teu cliente te procurou e achou o vizinho? · Pronto pra Temporada",
  description:
    "Teste grátis de 10 segundos para restaurantes, bares e comércios do litoral de Florianópolis: descobre onde teu negócio tá vazando cliente antes da temporada.",
  openGraph: {
    title: "Teu cliente te procurou hoje… e achou o vizinho.",
    description: "Faz o teste de 10 segundos e descobre onde o teu negócio tá vazando cliente antes da temporada.",
    locale: "pt_BR",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0e2620",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="grain">
        {children}
        <Medicao />
      </body>
    </html>
  );
}
