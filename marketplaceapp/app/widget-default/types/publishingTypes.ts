export interface PublishingMetric {
  id: string
  itemId: string
  itemName: string
  templateId: string
  templateName: string
  language: string
  path: string
  version: number
  createdDate: string // ISO date string
  publishedDate: string // ISO date string
  timeToPublishMs: number // Calculated: publishedDate - createdDate
  publishedBy: string
}

export interface ChartDataPoint {
  date: string
  fastest: number
  slowest: number
  average: number
  median: number
  items: number
}

export interface TimeToPublishStats {
  fastest: number
  slowest: number
  average: number
  median: number
  totalItems: number
  successRate: number
}

export interface FilterOptions {
  dateRange: {
    start: Date
    end: Date
    preset: "7days" | "30days" | "90days" | "custom"
  }
  paths: string[]
  templates: string[]
  languages: string[]
  showWorkflowData: boolean
  comparisonRange?: {
    start: Date
    end: Date
  }
}
