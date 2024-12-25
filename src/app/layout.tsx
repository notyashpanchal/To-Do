import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Todo App",
    template: "%s | Todo App",
  },
  description:
    "A simple and efficient task management application to organize your daily activities. Built with Next.js, Prisma, and MongoDB for fast performance and scalability.",
  openGraph: {
    title: "Todo App",
    description:
      "A simple and efficient task management application to organize your daily activities. Built with Next.js, Prisma, and MongoDB for fast performance and scalability.",
    url: "https://yourtodoapp.com",
    siteName: "Todo App",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: "Todo App",
    card: "summary_large_image",
  },
  verification: {
    google: "",
    yandex: "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased tracking-tighter`}
      >
        {children}
      </body>
    </html>
  );
}
