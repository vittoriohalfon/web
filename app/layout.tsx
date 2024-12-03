import React from 'react';
import '@/app/globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import localFont from 'next/font/local';
import type { Metadata } from 'next';
import Hotjar from '@hotjar/browser';

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Initialize Hotjar
const hotjarSiteId = 5228160;
const hotjarVersion = 6;

// Only initialize Hotjar if not in development
Hotjar.init(hotjarSiteId, hotjarVersion, {
  debug: true
});

export const metadata: Metadata = {
  title: "Skim Application",
  description: "Skim is a tender management software that helps you manage your tenders and bids. It is a platform that allows you to create, manage, and track your tenders and bids.",
  icons: {
    icon: [
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon/favicon.ico', rel: 'shortcut icon' },
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/favicon/site.webmanifest',
  appleWebApp: {
    title: 'Skim Application',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ClerkProvider dynamic>
        <body className={`min-h-screen bg-gray-50 ${geistMono.variable} antialiased`}>
          {children}
        </body>
      </ClerkProvider>
    </html>
  );
}