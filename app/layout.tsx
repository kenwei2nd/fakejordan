import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sneaker Hero — 5 Variations",
  description: "Interactive scroll-driven sneaker hero section",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        {children}
      </body>
    </html>
  );
}
