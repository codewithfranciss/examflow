import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({ subsets: ['latin'], weight: ['100', '200', '300', '400', '500', '600'] });

export const metadata: Metadata = {
  title: "ExamFLow",
  description: "A quiz web based cbt app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className}`}
      >

        {children}
        <Toaster position="top-right" reverseOrder={false} />
        
      </body>
    </html>
  );
}