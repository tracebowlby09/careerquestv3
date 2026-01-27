import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Career Quest - Interactive Career Exploration Game",
  description: "Explore careers through interactive challenges. Experience what different jobs are like and learn the skills they require.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
