import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Waker from "@/components/Waker";
import { LoaderProvider } from "@/store/LoaderContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'Novox',
    template: '%s | Novox'
  },
  description: "Novox is a trading company where you can be a part of the peer-to-peer exchange community worldwide, we offer a unique investment model to traders of bitcoin and other methods.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
      >
        <Waker>
          <LoaderProvider>{children}</LoaderProvider>
        </Waker>
      </body>
    </html>
  );
}
