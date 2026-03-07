export const chartConfig = {
  fastest: {
    label: "Fastest",
    color: "#10b981", // Green-500
  },
  slowest: {
    label: "Slowest",
    color: "#ef4444", // Red-500
  },
  average: {
    label: "Average",
    color: "#3b82f6", // Blue-500
  },
  median: {
    label: "Median",
    color: "#8b5cf6", // Purple-500
  },
  items: {
    label: "Items Published",
    color: "#e5e7eb", // Gray-200 for bars
  },
}

export const datePresets = [
  { value: "7days", label: "Last 7 Days" },
  { value: "30days", label: "Last 30 Days" },
  { value: "90days", label: "Last 90 Days" },
  { value: "custom", label: "Custom Range" },
]
