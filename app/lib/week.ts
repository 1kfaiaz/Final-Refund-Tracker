export function getCurrentWeekKey(date = new Date()) {
  const year = date.getFullYear()
  const firstDay = new Date(year, 0, 1)
  const pastDays = Math.floor(
    (date.getTime() - firstDay.getTime()) / 86400000
  )
  const week = Math.ceil((pastDays + firstDay.getDay() + 1) / 7)
  return `${year}-W${week}`
}
