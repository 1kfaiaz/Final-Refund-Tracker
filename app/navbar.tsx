"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const nav = [
  { label: "Dashboard", href: "/" },
  { label: "Log Refund", href: "/refunds/new" },
  { label: "Refund List", href: "/refunds" },
  { label: "AI Report", href: "/ai-summary" },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl gap-8 px-6 py-4">
        {nav.map((item) => {
          const active = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm transition ${
                active
                  ? "font-semibold text-blue-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
