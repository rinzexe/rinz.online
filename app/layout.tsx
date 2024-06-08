import type { Metadata } from "next";
import "./globals.css";
import { Canvas } from "@react-three/fiber";
import { Text } from "@react-three/uikit";
import ClientLayout from "./ClientLayout";

export const metadata: Metadata = {
  title: "rinz.online",
  description: "My personal site :P",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log("rootreset")
  return (
    <html lang="en">
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
