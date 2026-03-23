import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pilot.smoothsend.xyz"),
  title: {
    default: "SmoothSend Pilot Program — 30 Days of Free Gas",
    template: "%s — SmoothSend Pilot Program",
  },
  description:
    "AIP-141 is 10x-ing gas fees on Aptos. The SmoothSend Pilot Program gives your dApp 30 days of 100% gasless transactions — free. Apply now.",
  keywords: [
    "aptos",
    "gasless transactions",
    "gas sponsorship",
    "AIP-141",
    "smoothsend",
    "pilot program",
    "dapp",
    "blockchain",
    "web3",
    "aptos mainnet",
    "free gas",
  ],
  authors: [{ name: "SmoothSend", url: "https://smoothsend.xyz" }],
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "SmoothSend Pilot Program — 30 Days of Free Gas",
    description:
      "AIP-141 is 10x-ing gas fees on Aptos. Apply to the SmoothSend Pilot Program and protect your users.",
    url: "https://pilot.smoothsend.xyz",
    siteName: "SmoothSend Pilot Program",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SmoothSend Pilot Program — 30 Days of Free Gas on Aptos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SmoothSend Pilot Program — 30 Days of Free Gas",
    description:
      "AIP-141 is 10x-ing gas fees on Aptos. Apply to the SmoothSend Pilot Program and protect your users.",
    site: "@SmoothSend",
    creator: "@SmoothSend",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark h-full">
      <body className={`${inter.className} min-h-full antialiased`}>
        {children}
      </body>
    </html>
  );
}
