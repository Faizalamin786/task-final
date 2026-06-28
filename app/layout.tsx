import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShieldDrive Insurance | Free Auto Insurance Quotes",
  description: "Compare personalized auto insurance quotes in 2 minutes. No spam, no hassle. Licensed in all 50 states.",
  keywords: "auto insurance, car insurance quotes, cheap insurance, vehicle insurance",
  openGraph: {
    title: "ShieldDrive Insurance | Free Auto Insurance Quotes",
    description: "Compare personalized auto insurance quotes in 2 minutes.",
    url: "https://shielddrive.vercel.app",
    siteName: "ShieldDrive Insurance",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShieldDrive Insurance | Free Auto Insurance Quotes",
    description: "Compare personalized auto insurance quotes in 2 minutes.",
  },
  robots: {
    index: true,
    follow: true,
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
     <body>
  {children}
  <Toaster
    position="top-right"
    toastOptions={{
      duration: 3000,
    }}
  />
</body>
    </html>
  );
}
