import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Talentify SV - El futuro del talento IT está aquí",
  description:
    "Conectamos a la élite tecnológica de El Salvador con las empresas globales más disruptivas. Tu próximo gran salto profesional comienza con una curaduría de excelencia.",
  keywords: [
    "empleo",
    "trabajo",
    "El Salvador",
    "IT",
    "tecnología",
    "desarrollador",
    "programador",
    "remoto",
  ],
  authors: [{ name: "Talentify SV" }],
  openGraph: {
    title: "Talentify SV - El futuro del talento IT está aquí",
    description:
      "Conectamos a la élite tecnológica de El Salvador con las empresas globales más disruptivas.",
    type: "website",
    locale: "es_SV",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#071326",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark bg-background">
      <body
        className={`${inter.variable} ${plusJakartaSans.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
