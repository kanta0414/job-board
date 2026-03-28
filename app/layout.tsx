import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "求人検索アプリ",
  description: "求人の検索・投稿",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
