import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Taghyeer",
  description: "Real-time 1:1 and group chat",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
