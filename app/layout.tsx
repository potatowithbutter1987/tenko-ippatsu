import { Inter, Noto_Sans_JP } from "next/font/google";

import "@/app/globals.css";

import { ViewportSwitcher } from "@/components/layout/ViewportSwitcher";

import type { Metadata, Viewport } from "next";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const notoSansJp = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "点呼一発",
  description: "点呼一発 ドライバー画面",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${inter.variable} ${notoSansJp.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-white text-[#0e0f0c]">
        <ViewportSwitcher />
        {children}
      </body>
    </html>
  );
}
