"use client"

import { MarketplaceProvider } from "@/components/providers/marketplace"
import { useState, useEffect, useMemo } from "react"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import { DatePickerWithRange } from "@/components/ui/date-picker"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CircularProgress } from "@/components/ui/circular-progress"

import { generateDummyData, processChartData } from "./utils/dummyData"
import { chartConfig, datePresets } from "./constants/chartConfig"
import { FilterOptions, PublishingMetric } from "./types/publishingTypes"
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import { saveAs } from "file-saver"
import { utils, write } from "xlsx"

function WidgetDefault() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [metrics, setMetrics] = useState<PublishingMetric[]>([])
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: {
      start: new Date(new Date().setDate(new Date().getDate() - 30)),
      end: new Date(),
      preset: "30days",
    },
    paths: [],
    templates: [],
    languages: [],
    showWorkflowData: false,
  })
  const [showLegend, setShowLegend] = useState(true)

  // Generate dummy data on mount
  useEffect(() => {
    try {
      const data = generateDummyData()
      setMetrics(data)
      setLoading(false)
    } catch {
      setError("Failed to load publishing data")
      setLoading(false)
    }
  }, [])

  // Process filtered data
  const { chartData, stats } = useMemo(() => {
    if (metrics.length === 0) return { chartData: [], stats: getEmptyStats() }

    let filtered = [...metrics]

    // Apply filters
    filtered = filtered.filter((metric) => {
      const createdDate = new Date(metric.createdDate)
      return (
        createdDate >= filters.dateRange.start &&
        createdDate <= filters.dateRange.end
      )
    })

    if (filters.paths.length > 0) {
      filtered = filtered.filter((metric) =>
        filters.paths.includes(metric.path)
      )
    }

    if (filters.templates.length > 0) {
      filtered = filtered.filter((metric) =>
        filters.templates.includes(metric.templateId)
      )
    }

    if (filters.languages.length > 0) {
      filtered = filtered.filter((metric) =>
        filters.languages.includes(metric.language)
      )
    }

    return processChartData(filtered)
  }, [metrics, filters])

  // Get available filter options from data
  const availablePaths = useMemo(() => {
    const pathSet = new Set<string>()
    metrics.forEach((m) => pathSet.add(m.path))
    return Array.from(pathSet)
  }, [metrics])

  const availableTemplates = useMemo(() => {
    const templateMap = new Map<string, { id: string; name: string }>()
    metrics.forEach((m) => {
      if (!templateMap.has(m.templateId)) {
        templateMap.set(m.templateId, {
          id: m.templateId,
          name: m.templateName,
        })
      }
    })
    return Array.from(templateMap.values())
  }, [metrics])

  const availableLanguages = useMemo(() => {
    const languageSet = new Set<string>()
    metrics.forEach((m) => languageSet.add(m.language))
    return Array.from(languageSet)
  }, [metrics])

  const handleFilterChange = (key: string, value: unknown) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleDatePresetChange = (
    preset: FilterOptions["dateRange"]["preset"]
  ) => {
    const now = new Date()
    const start = new Date()

    switch (preset) {
      case "7days":
        start.setDate(now.getDate() - 7)
        break
      case "30days":
        start.setDate(now.getDate() - 30)
        break
      case "90days":
        start.setDate(now.getDate() - 90)
        break
      case "custom":
        // Keep existing custom dates
        return
    }

    setFilters((prev) => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        start,
        end: now,
        preset,
      },
    }))
  }

  const handleExportJSON = () => {
    const exportData = {
      metadata: {
        generatedAt: new Date().toISOString(),
        filters,
        stats,
      },
      chartData,
      items: metrics,
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    })
    saveAs(
      blob,
      `publishing-metrics-${new Date().toISOString().split("T")[0]}.json`
    )
  }

  const handleExportCSV = () => {
    const csvData = metrics.map((item) => ({
      "Item ID": item.itemId,
      "Item Name": item.itemName,
      Template: item.templateName,
      Language: item.language,
      Path: item.path,
      Version: item.version,
      Created: item.createdDate,
      Published: item.publishedDate,
      "Time to Publish (ms)": item.timeToPublish,
      "Time to Publish (formatted)": formatDuration(item.timeToPublish),
      "Published By": item.publishedBy,
    }))

    const csv = utils.json_to_sheet(csvData)
    const workbook = utils.book_new()
    utils.book_append_sheet(workbook, csv, "Publishing Metrics")
    const excelBuffer = write(workbook, { bookType: "xlsx", type: "array" })
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" })
    saveAs(
      blob,
      `publishing-metrics-${new Date().toISOString().split("T")[0]}.xlsx`
    )
  }

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ${hours % 24}h`
    if (hours > 0) return `${hours}h ${minutes % 60}m`
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`
    return `${seconds}s`
  }

  if (loading) {
    return (
      <MarketplaceProvider>
        <div className="flex h-64 items-center justify-center">
          <CircularProgress />
        </div>
      </MarketplaceProvider>
    )
  }

  if (error) {
    return (
      <MarketplaceProvider>
        <Card className="p-4 text-red-600">
          <h3 className="mb-2 font-semibold">Error Loading Data</h3>
          <p>{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </Card>
      </MarketplaceProvider>
    )
  }

  return (
    <MarketplaceProvider>
      <div className="container mx-auto p-4">
        <h1 className="mb-6 text-2xl font-bold">Time to Publish Analytics</h1>
        {/* Controls Row - Date Range, Filters, and Export */}
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Date Range Presets */}
          <div>
            <label className="mb-1 block text-sm font-medium">Date Range</label>
            <div className="flex flex-wrap gap-1">
              {datePresets.map((preset) => (
                <Button
                  key={preset.value}
                  variant={
                    filters.dateRange.preset === preset.value
                      ? "default"
                      : "outline"
                  }
                  size="xs"
                  className="h-7 px-2"
                  onClick={() =>
                    handleDatePresetChange(
                      preset.value as FilterOptions["dateRange"]["preset"]
                    )
                  }
                >
                  {preset.label}
                </Button>
              ))}
            </div>
            {filters.dateRange.preset === "custom" && (
              <div className="mt-2">
                <DatePickerWithRange />
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Select
                onValueChange={(value) =>
                  setFilters({ ...filters, paths: value ? [value] : [] })
                }
                value={filters.paths[0] || ""}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Path" />
                </SelectTrigger>
                <SelectContent>
                  {availablePaths.map((path) => (
                    <SelectItem key={path} value={path}>
                      {path}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                onValueChange={(value) =>
                  setFilters({ ...filters, templates: value ? [value] : [] })
                }
                value={filters.templates[0] || ""}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Template" />
                </SelectTrigger>
                <SelectContent>
                  {availableTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                onValueChange={(value) =>
                  setFilters({ ...filters, languages: value ? [value] : [] })
                }
                value={filters.languages[0] || ""}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  {availableLanguages.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters Button */}
            {!!(
              filters.paths.length ||
              filters.templates.length ||
              filters.languages.length
            ) && (
              <Button
                variant="outline"
                size="xs"
                className="h-7 self-end"
                onClick={() =>
                  setFilters({
                    ...filters,
                    paths: [],
                    templates: [],
                    languages: [],
                  })
                }
              >
                Clear Filters
              </Button>
            )}
          </div>

          {/* Export and Legend Controls */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex w-full gap-2">
              <Select
                onValueChange={(value) => {
                  if (value === "json") handleExportJSON()
                  if (value === "csv") handleExportCSV()
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Export" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">Export as JSON</SelectItem>
                  <SelectItem value="csv">Export as Excel (CSV)</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="xs"
                className="h-9"
                onClick={() => setShowLegend(!showLegend)}
              >
                {showLegend ? "Hide Legend" : "Show Legend"}
              </Button>
            </div>
          </div>
        </div>
        {filters.dateRange.preset === "custom" && (
          <div className="flex gap-2 md:col-span-3">
            <DatePickerWithRange />
          </div>
        )}
        {/* Metrics Summary */}
        <Card className="mb-4 p-4">
          <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4 lg:grid-cols-6">
            <div>
              <div className="text-sm text-gray-500">Period</div>
              <div className="font-mono text-lg">
                {`${filters.dateRange.start.toLocaleDateString()} - ${filters.dateRange.end.toLocaleDateString()}`}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Items</div>
              <div className="font-mono text-lg">{stats.totalItems}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Fastest</div>
              <div className="font-mono text-lg text-green-600">
                {formatDuration(stats.fastest)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Slowest</div>
              <div className="font-mono text-lg text-red-600">
                {formatDuration(stats.slowest)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Average</div>
              <div className="font-mono text-lg text-blue-600">
                {formatDuration(stats.average)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Median</div>
              <div className="font-mono text-lg text-purple-600">
                {formatDuration(stats.median)}
              </div>
            </div>
          </div>
        </Card>
        {/* Chart View */}
        <Card className="mt-4 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Time to Publish Analysis</h3>
            <button
              onClick={() => setShowLegend(!showLegend)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              {showLegend ? "Hide Legend" : "Show Legend"}
            </button>
          </div>

          <ChartContainer
            config={chartConfig}
            className="h-[500px] w-full"
            aria-label="Time to publish analysis chart"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  tickFormatter={(value) => formatDuration(value)}
                  width={60}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(value) => value.toString()}
                  label={{
                    value: "Items",
                    angle: -90,
                    position: "insideRight",
                  }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                {showLegend && <ChartLegend content={<ChartLegendContent />} />}
                <Bar
                  yAxisId="right"
                  dataKey="items"
                  name="Items Published"
                  fill="var(--color-items)"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="fastest"
                  name="Fastest"
                  stroke="var(--color-fastest)"
                  dot={false}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="slowest"
                  name="Slowest"
                  stroke="var(--color-slowest)"
                  dot={false}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="average"
                  name="Average"
                  stroke="var(--color-average)"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="median"
                  name="Median"
                  stroke="var(--color-median)"
                  strokeDasharray="5 5"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>
      </div>
    </MarketplaceProvider>
  )
}

function getEmptyStats() {
  return {
    fastest: 0,
    slowest: 0,
    average: 0,
    median: 0,
    totalItems: 0,
    successRate: 0,
  }
}

export default WidgetDefault
