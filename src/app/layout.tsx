import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import { AnalysisProvider } from "@/components/providers/AnalysisProvider";
import "./globals.css";

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata = {
  title: "Sentinel — Explainable Transaction Intelligence",
  description:
    "Context-aware financial transaction analysis with transparent, explainable risk assessment.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${mono.variable} antialiased`}>
        <AnalysisProvider>
          <AppShell>{children}</AppShell>
        </AnalysisProvider>
      </body>
    </html>
  );
}
