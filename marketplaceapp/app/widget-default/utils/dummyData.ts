import {
  PublishingMetric,
  ChartDataPoint,
  TimeToPublishStats,
} from "../types/publishingTypes"

export function generateDummyData(): PublishingMetric[] {
  const templates = [
    { id: "{76036F5E-CBCE-46D1-AF0A-4143F9B557AA}", name: "Article" },
    { id: "{0574E123-A85C-4B81-A74B-6E97A6257533}", name: "Product" },
    { id: "{B8F55733-18F6-4D2B-929C-547E14D5B710}", name: "News" },
  ]

  const languages = ["en", "da", "de"]
  const paths = [
    "/sitecore/content/Home",
    "/sitecore/content/Products",
    "/sitecore/content/Blog",
  ]
  const users = ["sitecore\\admin", "sitecore\\editor1", "sitecore\\editor2"]

  const data: PublishingMetric[] = []
  const now = new Date()

  // Generate data for the last 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date(now)
    date.setDate(now.getDate() - i)

    // Generate 5-15 items per day
    const itemsToday = 5 + Math.floor(Math.random() * 11)

    for (let j = 0; j < itemsToday; j++) {
      const template = templates[Math.floor(Math.random() * templates.length)]
      const language = languages[Math.floor(Math.random() * languages.length)]
      const path = paths[Math.floor(Math.random() * paths.length)]
      const user = users[Math.floor(Math.random() * users.length)]

      // Create a random item
      const createdDate = new Date(date)
      createdDate.setHours(
        9 + Math.floor(Math.random() * 8),
        Math.floor(Math.random() * 60)
      )

      // Published between 1 hour and 7 days later
      const publishDelayHours = 1 + Math.floor(Math.random() * 167)
      const publishedDate = new Date(createdDate)
      publishedDate.setHours(createdDate.getHours() + publishDelayHours)

      data.push({
        id: `item-${i}-${j}`,
        itemId: `item-${i}-${j}`,
        itemName: `Sample Item ${i}-${j}`,
        templateId: template.id,
        templateName: template.name,
        language,
        path,
        version: 1,
        createdDate: createdDate.toISOString(),
        publishedDate: publishedDate.toISOString(),
        timeToPublish: publishDelayHours * 60 * 60 * 1000,
        publishedBy: user,
      })
    }
  }

  return data
}

export function processChartData(metrics: PublishingMetric[]): {
  chartData: ChartDataPoint[]
  stats: TimeToPublishStats
} {
  // Group by date
  const byDate = new Map<string, PublishingMetric[]>()

  metrics.forEach((metric) => {
    const date = new Date(metric.createdDate).toISOString().split("T")[0]
    if (!byDate.has(date)) {
      byDate.set(date, [])
    }
    byDate.get(date)?.push(metric)
  })

  const chartData: ChartDataPoint[] = []
  const allTimes: number[] = []

  // Process each day
  Array.from(byDate.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([date, items]) => {
      const times = items.map((item) => item.timeToPublish)
      allTimes.push(...times)

      chartData.push({
        date,
        fastest: Math.min(...times),
        slowest: Math.max(...times),
        average: times.reduce((sum, t) => sum + t, 0) / times.length,
        median: calculateMedian(times),
        items: items.length,
      })
    })

  // Calculate overall stats
  const stats: TimeToPublishStats = {
    fastest: Math.min(...allTimes),
    slowest: Math.max(...allTimes),
    average: allTimes.reduce((sum, t) => sum + t, 0) / allTimes.length,
    median: calculateMedian(allTimes),
    totalItems: allTimes.length,
    successRate: 100, // All items in dummy data are published
  }

  return { chartData, stats }
}

function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0

  const sorted = [...values].sort((a, b) => a - b)
  const half = Math.floor(sorted.length / 2)

  if (sorted.length % 2) {
    return sorted[half]
  }

  return (sorted[half - 1] + sorted[half]) / 2.0
}
