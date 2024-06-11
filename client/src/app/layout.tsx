import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import RecoilRootProvider from "@/providers/RecoilRootProvider";
import { Toaster } from "react-hot-toast";
import UserProvider from "@/providers/UserProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Naveen Auth",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RecoilRootProvider>
          <UserProvider>
            <Toaster />
            <Navbar />
            {children}
          </UserProvider>
        </RecoilRootProvider>
      </body>
    </html>
  );
}
