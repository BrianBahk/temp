import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "../src/index.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ReadSphere - Magazine & Newspaper Subscriptions",
  description:
    "Subscribe to the world's best magazines and newspapers. Earn rewards with every purchase and enjoy free delivery.",
  authors: [{ name: "ReadSphere" }],
  openGraph: {
    title: "ReadSphere - Magazine & Newspaper Subscriptions",
    description:
      "Subscribe to the world's best magazines and newspapers. Earn rewards with every purchase and enjoy free delivery.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="icon" href="data:," />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
