import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PrepClever",
  description: "Courses and roadmaps for AI engineering roles at GCCs in India.",
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
