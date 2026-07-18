import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "بازی بزرگ خاورمیانه | ایران در برابر آمریکا و اسرائیل",
  description: "یک بازی استراتژیک تعاملی بر اساس تاریخچه مناسبات و درگیری‌های ایران، آمریکا و اسرائیل از ۱۹۵۳ تا ۲۰۲۵. با انتخاب کارت‌ها، آینده منطقه را رقم بزنید.",
  keywords: ["ایران", "آمریکا", "اسرائیل", "بازی استراتژیک", "خاورمیانه", "تاریخ معاصر"],
  authors: [{ name: "Strategic Games Studio" }],
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%230a0e1a'/%3E%3Ctext x='50' y='70' font-size='60' text-anchor='middle' fill='%2316a34a'%3E%E2%98%85%3C/text%3E%3C/svg%3E",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a0e1a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable} suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
