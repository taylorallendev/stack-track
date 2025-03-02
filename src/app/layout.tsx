import "~/styles/globals.css";

import { type Metadata } from "next";
import { ThemeProvider } from "~/components/layout/theme-provider";
import { GeistSans as geistSans } from "geist/font/sans";
import { ClerkProvider } from "@clerk/nextjs";

import localFont from "next/font/local";
import { Toaster } from "~/components/ui/sonner";

const overusedGrotesk = localFont({
  src: "./OverusedGrotesk-VF.woff2",
  variable: "--font-overused-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "StackTrack",
  description: "Simple, modern poker manager",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${overusedGrotesk.variable}`}
      suppressHydrationWarning
    >
      <body className={geistSans.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider>
            {children}
            <Toaster />
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
