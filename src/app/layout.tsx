import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flashforge — Multi-API Billing & Usage Analytics",
  description: "High-performance, self-hosted API billing, metering, and usage analytics dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-black text-zinc-100 antialiased selection:bg-zinc-800 selection:text-zinc-100">
        {children}
      </body>
    </html>
  );
}
