import "./globals.css";
import Navbar from "@/components/Navbar";
import type { ReactNode } from "react";

export const metadata = {
  title: "Recipez",
  description: "A modern foodie app built with Next.js",
};

export default function RootLayout({ children }:{children:ReactNode}) {
  return (
    <html lang="en">
      <body className="bg-orange-50 text-gray-800">
        <Navbar />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
