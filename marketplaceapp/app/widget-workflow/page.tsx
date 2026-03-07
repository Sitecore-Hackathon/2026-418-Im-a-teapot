"use client"

import { MarketplaceProvider } from "@/components/providers/marketplace"
import { useState, useEffect, useMemo } from "react"
import { FilterMultiSelect } from "@/components/ui/filter"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CircularProgress } from "@/components/ui/circular-progress"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"

import {
  generateDummyWorkflowStates,
  generateDummyWorkflowItems,
  calculateDaysInState,
  calculateHoursInState,
} from "./utils/dummyData"
import {
  WorkflowState,
  WorkflowItem,
  WorkflowThreshold,
} from "./types/workflowTypes"

function WidgetWorkflow() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [workflowStates, setWorkflowStates] = useState<WorkflowState[]>([])
  const [workflowItems, setWorkflowItems] = useState<WorkflowItem[]>([])
  const [selectedStates, setSelectedStates] = useState<string[]>([])
  const [threshold, setThreshold] = useState<WorkflowThreshold>({
    days: 7,
    hours: 0,
  })

  // Generate dummy data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const states = generateDummyWorkflowStates()
        const items = generateDummyWorkflowItems()
        const defaultState: string[] = states.length > 0 ? [states[0].id] : []
        return { states, items, defaultState }
      } catch {
        setError("Failed to load workflow data")
        setLoading(false)
        return { states: [], items: [], defaultState: [] as string[] }
      }
    }

    loadData().then(({ states, items, defaultState }) => {
      setWorkflowStates(states)
      setWorkflowItems(items)
      setSelectedStates(defaultState)
      setLoading(false)
    })
  }, [])

  // Filter items based on selected states and threshold
  const filteredItems = useMemo(() => {
    if (selectedStates.length === 0 || workflowItems.length === 0) return []

    const thresholdInHours = threshold.days * 24 + threshold.hours

    return workflowItems.filter((item) => {
      if (!selectedStates.includes(item.state)) return false

      const daysInState = calculateDaysInState(item.enteredStateDate)
      const hoursInState = calculateHoursInState(item.enteredStateDate)
      const totalHoursInState = daysInState * 24 + hoursInState

      return totalHoursInState > thresholdInHours
    })
  }, [selectedStates, threshold, workflowItems])

  const handleThresholdChange = (
    field: keyof WorkflowThreshold,
    value: string
  ) => {
    const numericValue = parseInt(value) || 0
    setThreshold((prev) => ({ ...prev, [field]: numericValue }))
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
        <h1 className="mb-6 text-2xl font-bold">Workflow State Monitoring</h1>

        {/* Controls Row */}
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Workflow State Selector */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Workflow States
            </label>
            <FilterMultiSelect
              value={selectedStates}
              onChange={setSelectedStates}
              options={workflowStates.map((state) => ({
                value: state.id,
                label: state.name,
              }))}
              placeholder="Select workflow states"
              displayMode="badge"
              maxDisplayItems={2}
            />
          </div>

          {/* Threshold Controls */}
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-medium">Threshold</label>
            <div className="flex gap-2">
              <div className="flex flex-1 items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  placeholder="Days"
                  value={threshold.days}
                  onChange={(e) =>
                    handleThresholdChange("days", e.target.value)
                  }
                  className="flex-1"
                />
                <span className="text-sm">days</span>
              </div>
              <div className="flex flex-1 items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  max="23"
                  placeholder="Hours"
                  value={threshold.hours}
                  onChange={(e) =>
                    handleThresholdChange("hours", e.target.value)
                  }
                  className="flex-1"
                />
                <span className="text-sm">hours</span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex items-end">
            <p className="text-sm text-gray-500">
              Shows items in selected states longer than threshold
            </p>
          </div>
        </div>

        {/* Summary */}
        <Card className="mb-4 p-4">
          <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
            <div>
              <div className="text-sm text-gray-500">Selected States</div>
              <div className="font-mono text-lg">
                {selectedStates.length === 0
                  ? "None"
                  : selectedStates
                      .map(
                        (stateId) =>
                          workflowStates.find((s) => s.id === stateId)?.name
                      )
                      .filter(Boolean)
                      .join(", ")}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Threshold</div>
              <div className="font-mono text-lg">
                {threshold.days} days {threshold.hours} hours
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Items in States</div>
              <div className="font-mono text-lg">
                {
                  workflowItems.filter((item) =>
                    selectedStates.includes(item.state)
                  ).length
                }
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Items in State</div>
              <div className="font-mono text-lg">
                {
                  workflowItems.filter((item) =>
                    selectedStates.includes(item.state)
                  ).length
                }
              </div>
            </div>
          </div>
        </Card>

        {/* Results Table */}
        <Card className="mt-4 p-4">
          <h3 className="mb-4 text-lg font-semibold">
            Items Exceeding Threshold
          </h3>

          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              No items found that exceed the threshold for the selected states.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Workflow</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>Path</TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Time in State</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => {
                    const daysInState = calculateDaysInState(
                      item.enteredStateDate
                    )
                    const hoursInState = calculateHoursInState(
                      item.enteredStateDate
                    )

                    return (
                      <TableRow key={`${item.id}-${item.version}`}>
                        <TableCell>
                          <button className="cursor-pointer text-primary hover:underline">
                            {item.itemName}
                          </button>
                        </TableCell>
                        <TableCell>{item.version}</TableCell>
                        <TableCell>{item.workflowName}</TableCell>
                        <TableCell>{item.stateName}</TableCell>
                        <TableCell>{item.path}</TableCell>
                        <TableCell>{item.templateName}</TableCell>
                        <TableCell>{item.language}</TableCell>
                        <TableCell>
                          {daysInState} days {hoursInState} hours
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>
    </MarketplaceProvider>
  )
}

export default WidgetWorkflow
