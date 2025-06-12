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
  title: "UN View - Get Rid Of Views",
  description: "UnView is a proof of concept that explores replacing traditional ERP views with LLM-generated UIs. Instead of building 100s of static screens, users describe what they need, and UnView creates personalized, focused interfaces on demand.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        <div className="z-10 w-full bg-card fixed top-0 left-0 right-0">
          <div className="chat-container mx-auto">
            <div className="p-4 text-center">
            📊 Personalized Admin UI - POC
            </div>
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
