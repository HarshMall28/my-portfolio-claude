import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google'
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-space-grotesk',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mono',
})


export const metadata: Metadata = {
  title: "Harsh Mall — Software Engineer",
  description: "Portfolio of Harsh Mall, a software engineer who builds things at a high level.",
  openGraph: {
    title: "Harsh Mall — Software Engineer",
    description: "Portfolio of Harsh Mall, a software engineer who builds things at a high level.",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "Harsh Mall",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  );
}
