import "./globals.css"
import Link from "next/link"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        {/* Nav */}
        <header className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-gray-800">
          <nav className="max-w-6xl mx-auto px-6 py-4 flex gap-6 text-sm font-medium">
            <Link
              href="/"
              className="text-gray-300 hover:text-white transition"
            >
              Dashboard
            </Link>
            <Link
              href="/refunds/new"
              className="text-gray-300 hover:text-white transition"
            >
              Log Refund
            </Link>
            <Link
              href="/refunds"
              className="text-gray-300 hover:text-white transition"
            >
              Refund List
            </Link>
            <Link
              href="/ai-summary"
              className="text-gray-300 hover:text-white transition"
            >
              AI Report
            </Link>
          </nav>
        </header>

        {/* Content */}
        <main className="max-w-6xl mx-auto px-6 py-10">
          {children}
        </main>
      </body>
    </html>
  )
}
