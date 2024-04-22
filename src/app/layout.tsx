import "~/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";
import { Topbar } from "./_components/topbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Construct Jobs",
  description: "Job board for construction workers.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <ClerkProvider>
          <Topbar />
          <TRPCReactProvider>
            <main className="flex min-h-screen w-full  flex-col items-center bg-stone-300/75 text-white">
              {children}
            </main>
          </TRPCReactProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
