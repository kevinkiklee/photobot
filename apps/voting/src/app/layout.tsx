import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";

const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const display = DM_Sans({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-display" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Photobot — Prompt Voting",
  description: "Vote on discussion prompts for the Photobot community",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `try{if(localStorage.getItem('theme')==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}catch(e){document.documentElement.classList.add('dark')}`,
        }} />
      </head>
      <body className={`${display.variable} ${body.variable} ${mono.variable} font-body grain`}>
        {children}
      </body>
    </html>
  );
}
