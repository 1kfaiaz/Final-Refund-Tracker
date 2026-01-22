import OpenAI from "openai"
import { refunds } from "@/app/lib/refunds"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

function getCurrentWeekKey() {
  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 1)
  const diffDays = Math.floor(
    (now.getTime() - startOfYear.getTime()) / 86400000
  )
  const week = Math.ceil((diffDays + startOfYear.getDay() + 1) / 7)
  return `${now.getFullYear()}-W${week}`
}

export async function GET() {
  const currentWeek = getCurrentWeekKey()
  const thisWeekRefunds = refunds.filter(
    r => r.weekKey === currentWeek
  )

  if (thisWeekRefunds.length === 0) {
    return Response.json({
      report: "No refunds recorded for this week.",
    })
  }

  const prompt = `
You are a restaurant operations analyst.

Analyse the following delivery refund data for THIS WEEK and produce
a professional management report.

Include:
- Executive summary
- Key trends
- Main refund causes
- Platforms causing most loss
- Operational weaknesses
- Clear, actionable recommendations

Tone:
- Professional
- Concise
- Business-focused
- No emojis

Refund data:
${JSON.stringify(thisWeekRefunds, null, 2)}
`

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a senior restaurant operations analyst." },
      { role: "user", content: prompt },
    ],
  })

  const report = completion.choices[0].message.content

  return Response.json({ report })
}
