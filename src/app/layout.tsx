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
  description: "Novox App",
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
