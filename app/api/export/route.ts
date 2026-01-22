import { refunds } from "@/app/lib/refunds"
import { getCurrentWeekKey } from "@/app/lib/week"

function toCSV(rows: any[]) {
  if (rows.length === 0) return ""

  const headers = Object.keys(rows[0])
  const csvRows = [
    headers.join(","), // header row
    ...rows.map(row =>
      headers
        .map(h => `"${String(row[h] ?? "").replace(/"/g, '""')}"`)
        .join(",")
    ),
  ]

  return csvRows.join("\n")
}

export async function GET() {
  const currentWeek = getCurrentWeekKey()

  const thisWeekRefunds = refunds.filter(
    r => r.weekKey === currentWeek
  )

  const csv = toCSV(thisWeekRefunds)

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="refunds-${currentWeek}.csv"`,
    },
  })
}
