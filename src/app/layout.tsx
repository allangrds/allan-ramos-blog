import type { Metadata } from "next";
import { Archivo_Black, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import "./globals.css";

// Archivo Black tem UMA única espessura (400). O peso é declarado explicitamente e 700/800 nunca
// são pedidos; `font-synthesis: none` em globals.css impede o navegador de sintetizar (FR-004a).
const archivo = Archivo_Black({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  adjustFontFallback: true,
});

// Corpo e título de card. O peso 700 do sistema vem sempre daqui, nunca de Archivo Black.
const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  adjustFontFallback: true,
});

// Data, tag, código e métrica.
const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "Allan Ramos",
  description: "Blog pessoal de Allan Ramos sobre desenvolvimento de software.",
  openGraph: {
    title: "Allan Ramos",
    description: "Blog pessoal de Allan Ramos sobre desenvolvimento de software.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${archivo.variable} ${grotesk.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
