import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "求职进度",
  description: "简洁的求职岗位追踪器"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
