import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WebBlock — Next-Gen AI E-Commerce Site Builder",
  description: "AI-powered e-commerce website builder with instant visual drag-and-drop customization, dynamic React code generation, and automated CI/CD deployment.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090d16] text-slate-100 antialiased min-h-screen selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
