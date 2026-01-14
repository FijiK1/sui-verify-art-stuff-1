import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers"; // Import vào

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sui Art Verifier",
  description: "Detect AI & Mint NFT on Sui",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers> {/* Bọc lại ở đây */}
      </body>
    </html>
  );
}