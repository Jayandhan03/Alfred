import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ALFRED — Your AI Life Mentor",
  description: "Tactical AI Life Guidance System. Observe. Analyze. Guide.",
  keywords: ["AI mentor", "life guidance", "Alfred AI", "tactical advisor"],
  openGraph: {
    title: "ALFRED — Your AI Life Mentor",
    description: "Observe. Analyze. Guide.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased w-full">
        {children}
      </body>
    </html>
  );
}
