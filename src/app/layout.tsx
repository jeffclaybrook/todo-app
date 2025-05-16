import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ReactNode } from "react"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "sonner"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "Todo App",
  description: "A simple todo app built with Next.js",
  manifest: "/manifest.json",
  themeColor: "#ffffff",
  openGraph: {
    title: "Todo App",
    description: "A simple todo app built with Next.js",
    url: "https://todo-app-coral-omega-23.vercel.app",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Todo App preview"
      }
    ],
    siteName: "Todo App",
    locale: "en_US",
    type: "website"
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="apple-touch-icon" href="/icon-192.png" />
        </head>
        <body className={`${inter.variable} antialiased`}>
          {children}
          <Toaster position="bottom-center" />
        </body>
      </html>
    </ClerkProvider>
  )
}