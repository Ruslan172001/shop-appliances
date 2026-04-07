import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "../styles/globals.css";
import Header from "@/styles/components/layout/header";
import AuthProvider from "@/styles/components/providers/auth-provider";
import { Toaster } from "@/styles/components/ui/sonner";
import { QueryProvider } from "@/styles/components/providers/query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Shop Appliances",
  description: "Интернет-магазин бытовой техники",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <QueryProvider>
          <AuthProvider>
            <Header />
            {children}
          </AuthProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
