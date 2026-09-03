import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ALGO — GO CURIOUS. The Engineering Proving Ground.",
  description:
    "Build technology. Make it better. Invent what's next. A platform where engineers learn real systems by building, measuring, and optimizing them.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased light">
      <body className="min-h-full flex flex-col bg-white text-slate-900 selection:bg-[#2d7cf6]/15 selection:text-[#2d7cf6]">
        {children}
      </body>
    </html>
  );
}
