"use client"

import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, AlertTriangle } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { DateRange } from "react-day-picker"

interface DateRangeFilterProps {
  value?: {
    after?: Date | string
    before?: Date | string
  }
  onChange?: (value: { after?: Date; before?: Date }) => void
  className?: string
}

export function DateRangeFilter({
  value,
  onChange,
  className,
}: DateRangeFilterProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: value?.after ? new Date(value.after) : undefined,
    to: value?.before ? new Date(value.before) : undefined,
  })

  const prevRangeRef = useRef<DateRange | undefined>(dateRange)

  // Convert DateRange to our format and call onChange
  const handleDateChange = useCallback(
    (range: DateRange | undefined) => {
      // Check if the range actually changed to prevent unnecessary calls
      const rangeChanged =
        JSON.stringify(prevRangeRef.current) !== JSON.stringify(range)

      if (!rangeChanged) {
        return
      }

      setDateRange(range)
      prevRangeRef.current = range

      if (range?.from || range?.to) {
        onChange?.({
          after: range?.from,
          before: range?.to,
        })
      } else {
        onChange?.({})
      }
    },
    [onChange]
  )

  // Validate dates
  const validationError =
    dateRange?.from && dateRange?.to && dateRange.from > dateRange.to
      ? "After date cannot be later than before date"
      : null

  const hasActiveFilters = dateRange?.from || dateRange?.to

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            hasActiveFilters && "bg-accent text-accent-foreground",
            validationError && "border-destructive",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {hasActiveFilters ? (
            <>
              {dateRange?.from ? format(dateRange.from, "PPP") : "No start"} -{" "}
              {dateRange?.to ? format(dateRange.to, "PPP") : "No end"}
            </>
          ) : (
            <span>Filter by Date Range</span>
          )}
          {validationError && (
            <AlertTriangle className="ml-2 h-4 w-4 text-destructive" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">Date Range</h4>
            <p className="text-sm text-muted-foreground">
              Select a date range to filter results (inclusive)
            </p>
            {validationError && (
              <div className="flex items-center text-sm text-destructive">
                <AlertTriangle className="mr-1 h-3 w-3" />
                {validationError}
              </div>
            )}
          </div>

          <div className="grid gap-4">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={handleDateChange}
              numberOfMonths={2}
              captionLayout="dropdown"
            />
          </div>

          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDateChange(undefined)}
              disabled={!hasActiveFilters}
            >
              Clear Dates
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
