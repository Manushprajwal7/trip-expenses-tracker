import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Trip Expenses Tracker",
  description: "Manage your group expenses efficiently",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <header className="bg-background border-b">
              <div className="container mx-auto px-4 py-2 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold">
                  Trip Expenses Tracker
                </Link>
                <nav className="flex items-center space-x-4">
                  <Link href="/trips" className="hover:underline">
                    Trips
                  </Link>
                  <Link href="/create-trip" className="hover:underline">
                    Add Trip
                  </Link>
                  <Link href="/settings" className="hover:underline">
                    Settings
                  </Link>
                  <ThemeToggle />
                </nav>
              </div>
            </header>
            <main className="flex-grow">
              {children}
            </main>
            <footer className="bg-background border-t py-4 text-center">
              <p>&copy; 2024 Trip Expenses Tracker. All rights reserved.</p>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

