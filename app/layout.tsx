import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mezcal Prompt Generator",
  description: "Generate Gemini-ready image prompts for mezcal photography",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}