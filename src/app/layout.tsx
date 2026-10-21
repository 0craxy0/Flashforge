import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flashforge — AI billing overview",
  description: "AI API token billing, metering, and provider pricing analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
