"use client";

import { useState, useCallback, useEffect, Fragment, ReactNode } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Icon } from "@/lib/icon";
import { mdiChevronDown, mdiChevronRight, mdiChevronUp, mdiClockOutline } from "@mdi/js";
import { cn } from "@/lib/utils";
import { DateRangeFilter } from "./date-range-filter";
import type { ActionEntry, FieldChange } from "./test-data";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";


export function FilterTable({
  data,
  showFieldChanges = true,
  emptyStateMessage = "No actions found",
  className,
  onRowExpand,
  onFilterChange,
  debounceTime = 300,
  openFiltersByDefault = true
}: {
  data:
  | ActionEntry[]
  | ((
    filters: Record<string, unknown>
  ) => ActionEntry[] | Promise<ActionEntry[]>);
  showFieldChanges?: boolean;
  emptyStateMessage?: string;
  className?: string;
  onRowExpand?: (entry: ActionEntry, isExpanded: boolean) => void;
  onFilterChange?: (filters: Record<string, unknown>) => void;
  debounceTime?: number;
  openFiltersByDefault?: boolean;
}) {
  const [state, setState] = useState({
    expandedRows: new Set<string>(),
    filterValues: {} as Record<string, unknown>,
    filteredData: [] as ActionEntry[],
    isLoading: true,
    error: null as Error | null,
  });

  const [isOpen, setIsOpen] = useState<boolean>(openFiltersByDefault ?? true);

  // Fetch data from API with current filters
  const fetchData = useCallback(
    async (currentFilters: Record<string, unknown> = {}) => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        let dataResult;
        if (typeof data === "function") {
          dataResult = await (
            data as (
              filters: Record<string, unknown>
            ) => ActionEntry[] | Promise<ActionEntry[]>
          )(currentFilters);
        } else {
          dataResult = data;
        }

        const entries = Array.isArray(dataResult) ? dataResult : [];
        setState((prev) => ({
          ...prev,
          filteredData: entries,
          isLoading: false,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error:
            error instanceof Error ? error : new Error("Failed to load data"),
          isLoading: false,
        }));
      }
    },
    [data]
  );

  // Handle date range filter changes (immediate API call)
  const handleDateRangeChange = useCallback(
    (range: { after?: Date; before?: Date; }) => {
      const newFilters = { ...state.filterValues, dateRange: range };
      setState((prev) => ({ ...prev, filterValues: newFilters }));

      if (onFilterChange) {
        onFilterChange(newFilters);
      }

      // Immediate fetch for date changes
      fetchData(newFilters);
    },
    [state.filterValues, onFilterChange, fetchData]
  );

  // Handle other filter changes (debounced API call)
  const handleFilterChange = useCallback(
    (key: string, value: unknown) => {
      const newFilters = { ...state.filterValues, [key]: value };

      // Check if filters actually changed
      const filtersChanged =
        JSON.stringify(state.filterValues) !== JSON.stringify(newFilters);
      if (!filtersChanged) {
        return;
      }

      setState((prev) => ({ ...prev, filterValues: newFilters }));

      if (onFilterChange) {
        onFilterChange(newFilters);
      }

      // Debounced fetch for other filters
      const timer = setTimeout(() => {
        fetchData(newFilters);
      }, debounceTime);

      return () => clearTimeout(timer);
    },
    [state.filterValues, onFilterChange, debounceTime, fetchData]
  );

  const handleClearAll = useCallback(() => {
    setState((prev) => ({ ...prev, filterValues: {} }));
    if (onFilterChange) {
      onFilterChange({});
    }
  }, [onFilterChange]);

  const toggleRowExpansion = useCallback(
    (entryId: string) => {
      const newExpandedRows = new Set(state.expandedRows);
      if (newExpandedRows.has(entryId)) {
        newExpandedRows.delete(entryId);
      } else {
        newExpandedRows.add(entryId);
      }

      setState((prev) => ({ ...prev, expandedRows: newExpandedRows }));

      const entry = state.filteredData.find((e) => e.id === entryId);
      if (entry && onRowExpand) {
        onRowExpand(entry, !state.expandedRows.has(entryId));
      }
    },
    [state.expandedRows, state.filteredData, onRowExpand]
  );

  const formatDate = useCallback((date: Date | string) => {
    if (!date) return "-";

    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return "Invalid date";

    return dateObj.toLocaleString();
  }, []);

  const formatFieldValue = (value: unknown): string => {
    if (value === null) return "null";
    if (value === undefined) return "undefined";
    if (typeof value === "boolean") return value ? "true" : "false";
    return String(value);
  };

  // Initialize data on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (state.isLoading) {
    return (
      <div className={cn("flex items-center justify-center py-8", className)}>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Icon path={mdiClockOutline} className="animate-spin" />
          <span>Loading actions...</span>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className={cn("py-8 text-center text-destructive", className)}>
        <p>Error loading actions: {state.error.message}</p>
      </div>
    );
  }

  if (state.filteredData.length === 0) {
    return (
      <div className={cn("py-8 text-center text-muted-foreground", className)}>
        <p>{emptyStateMessage}</p>
      </div>
    );
  }

  // Extract unique values for filter options
  const users = Array.from(
    new Set(state.filteredData.map((entry) => entry.user))
  );
  const actions = Array.from(
    new Set(state.filteredData.map((entry) => entry.actionPerformed))
  );

  return (
    <div className={cn("space-y-4", className)}>
      {/* Filter Controls */}
      <div className="border-b pb-4">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              colorScheme={"neutral"}
              aria-label="Toggle filters"
            >
              <Icon path={isOpen ? mdiChevronUp : mdiChevronDown} />
              Filters
            </Button>

          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="flex flex-wrap items-center gap-4">
              {/* Date Range Filter */}
              <DateRangeFilter
                value={
                  state.filterValues.dateRange as { after?: Date; before?: Date; }
                }
                onChange={handleDateRangeChange}
              />

              {/* User Filter */}
              <Select
                value={(state.filterValues.user as string) || ""}
                onValueChange={(value) => handleFilterChange("user", value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user} value={user}>
                      {user}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Action Filter */}
              <Select
                value={(state.filterValues.action as string) || ""}
                onValueChange={(value) => handleFilterChange("action", value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  {actions.map((action) => (
                    <SelectItem key={action} value={action}>
                      {action}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Clear All Button */}
              {Object.keys(state.filterValues).length > 0 && (
                <Button
                  onClick={handleClearAll}
                  variant="link"
                  size="sm"
                  className="w-fit"
                >
                  Clear all filters
                </Button>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Main Table */}
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]"></TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>State Before</TableHead>
            <TableHead>State After</TableHead>
            <TableHead>Action Performed</TableHead>
            <TableHead>Fields Changed</TableHead>
            <TableHead>User</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {state.filteredData.map((entry) => (
            <Fragment key={entry.id}>
              {/* Main Row */}
              <TableRow>
                <TableCell>
                  {showFieldChanges && entry.fieldChanges.length > 0 && (
                    <Button
                      onClick={() => toggleRowExpansion(entry.id)}
                      variant="outline"
                      size="icon-sm"
                    >
                      {state.expandedRows.has(entry.id) ? (
                        <Icon path={mdiChevronDown} size={1} />
                      ) : (
                        <Icon path={mdiChevronRight} size={1} />
                      )}
                    </Button>
                  )}
                </TableCell>
                <TableCell>{formatDate(entry.datetime)}</TableCell>
                <TableCell>{entry.stateBefore}</TableCell>
                <TableCell>{entry.stateAfter}</TableCell>
                <TableCell>{entry.actionPerformed}</TableCell>
                <TableCell>
                  <Badge colorScheme="primary" size="sm">
                    {entry.numberOfFields}
                  </Badge>
                </TableCell>
                <TableCell>{entry.user}</TableCell>
              </TableRow>

              {/* Expandable Field Changes */}
              {state.expandedRows.has(entry.id) && (
                <TableRow>
                  <TableCell colSpan={7} className="p-0">
                    <div className="mb-2 text-sm text-muted-foreground">
                      Field Changes:
                    </div>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="p-2 text-left font-medium">
                            Field Name
                          </th>
                          <th className="p-2 text-left font-medium">Before</th>
                          <th className="p-2 text-left font-medium">After</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entry.fieldChanges.map(
                          (change: FieldChange, index: number) => (
                            <tr key={index} className="border-b last:border-0">
                              <td className="p-2 font-mono">
                                {change.fieldName}
                              </td>
                              <td className="p-2">
                                {formatFieldValue(change.beforeValue)}
                              </td>
                              <td className="p-2">
                                {formatFieldValue(change.afterValue)}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </TableCell>
                </TableRow>
              )}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
