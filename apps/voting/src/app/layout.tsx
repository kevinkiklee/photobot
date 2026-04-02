import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";

const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const display = DM_Sans({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-display" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Photography Lounge — Discussion Prompt Voting",
  description: "Vote on 400+ discussion prompts, submit your own, and help shape what gets posted in the Photography Lounge community.",
  icons: { icon: "/favicon.svg" },
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3200"),
  openGraph: {
    title: "Photography Lounge — Discussion Prompt Voting",
    description: "Vote on 400+ discussion prompts, submit your own, and help shape what gets posted in the Photography Lounge community.",
    siteName: "Photobot",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Photography Lounge — Discussion Prompt Voting",
    description: "Vote on 400+ discussion prompts and help shape the community.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `try{var t=localStorage.getItem('theme');if(t==='dark')document.documentElement.classList.add('dark');else if(t==='light')document.documentElement.classList.remove('dark');else if(window.matchMedia('(prefers-color-scheme:dark)').matches)document.documentElement.classList.add('dark')}catch(e){}`,
        }} />
      </head>
      <body className={`${display.variable} ${body.variable} ${mono.variable} font-body grain`}>
        {children}
      </body>
    </html>
  );
}
