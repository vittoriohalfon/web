import React from 'react';
import '@/app/globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import localFont from 'next/font/local';
import type { Metadata } from 'next';

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Your App Name",
  description: "Your app description",
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