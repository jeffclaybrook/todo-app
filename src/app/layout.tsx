import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ReactNode } from "react"
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "next-themes"
import { Toaster } from "sonner"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "Todo App",
  description: "A simple todo app built with NextJS and shadcn/ui"
}

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <ClerkProvider
      appearance={{
        theme: "simple"
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableColorScheme
            disableTransitionOnChange
          >
            {children}
            <Toaster position="bottom-center" richColors />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}