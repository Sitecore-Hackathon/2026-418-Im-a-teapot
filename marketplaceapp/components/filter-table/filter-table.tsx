"use client";

import { useState, useEffect, useCallback, Fragment } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { FilterBar, FilterDefinition } from "@/components/ui/filter";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/lib/icon";
import { mdiChevronDown, mdiChevronRight, mdiClockOutline } from "@mdi/js";
import { cn } from "@/lib/utils";
import type {
  ActionEntry,
  FilterTableProps,
  FilterTableState,
  DataFetchFunction,
} from "./types";
import { Button } from "../ui/button";

export function FilterTable({
  data,
  filters = [],
  showFieldChanges = true,
  emptyStateMessage = "No actions found",
  className,
  onRowExpand,
  onFilterChange,
  serverSideFiltering = false,
  debounceTime = 300,
}: FilterTableProps) {
  const [state, setState] = useState<FilterTableState>({
    expandedRows: new Set(),
    filterValues: {},
    filteredData: [],
    isLoading: true,
    error: null,
  });

  // Fetch and process data
  const fetchData = useCallback(
    async (currentFilters: Record<string, unknown> = {}) => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        let dataResult;
        if (typeof data === "function") {
          // If it's a function, call it with filters if server-side filtering is enabled
          if (serverSideFiltering) {
            dataResult = await (data as DataFetchFunction)(currentFilters);
          } else {
            dataResult = await (
              data as () => ActionEntry[] | Promise<ActionEntry[]>
            )();
          }
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
    [data, serverSideFiltering]
  );

  // Apply filters to data
  const applyFilters = useCallback(
    (entries: ActionEntry[], filters: Record<string, unknown>) => {
      return entries.filter((entry) => {
        // Date filter
        if (filters.date && entry.datetime) {
          const entryDate = new Date(entry.datetime);
          const filterDate = new Date(filters.date as string);
          if (entryDate.toDateString() !== filterDate.toDateString()) {
            return false;
          }
        }

        // User filter
        if (filters.user && entry.user) {
          const filterUsers = Array.isArray(filters.user)
            ? filters.user
            : [filters.user];
          if (!filterUsers.includes(entry.user)) {
            return false;
          }
        }

        // Action filter
        if (filters.action && entry.actionPerformed) {
          const filterActions = Array.isArray(filters.action)
            ? filters.action
            : [filters.action];
          if (
            !filterActions.some((action: string) =>
              entry.actionPerformed.toLowerCase().includes(action.toLowerCase())
            )
          ) {
            return false;
          }
        }

        // Field filter
        if (filters.field && entry.fieldChanges) {
          const fieldFilter = (filters.field as string).toLowerCase();
          if (
            !entry.fieldChanges.some((change) =>
              change.fieldName.toLowerCase().includes(fieldFilter)
            )
          ) {
            return false;
          }
        }

        return true;
      });
    },
    []
  );

  // Handle filter changes
  const handleFilterChange = useCallback(
    (key: string, value: unknown) => {
      const newFilterValues = { ...state.filterValues, [key]: value };
      setState((prev) => ({ ...prev, filterValues: newFilterValues }));

      if (onFilterChange) {
        onFilterChange(newFilterValues);
      }

      // If server-side filtering is enabled, fetch new data
      if (serverSideFiltering) {
        // Use setTimeout to debounce the API call
        const timer = setTimeout(() => {
          fetchData(newFilterValues);
        }, debounceTime);

        return () => clearTimeout(timer);
      }
    },
    [
      state.filterValues,
      onFilterChange,
      serverSideFiltering,
      debounceTime,
      fetchData,
    ]
  );

  // Handle clear all filters
  const handleClearAll = useCallback(() => {
    setState((prev) => ({ ...prev, filterValues: {} }));
    if (onFilterChange) {
      onFilterChange({});
    }
  }, [onFilterChange]);

  // Toggle row expansion
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

  // Format date
  const formatDate = useCallback((date: Date | string) => {
    if (!date) return "-";

    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return "Invalid date";

    // Simple formatting - can be enhanced with date-fns or similar
    return dateObj.toLocaleString();
  }, []);

  // Initialize data on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Apply filters when data or filters change (only for client-side filtering)
  useEffect(() => {
    if (
      !serverSideFiltering &&
      state.filteredData.length > 0 &&
      Object.keys(state.filterValues).length > 0
    ) {
      const filtered = applyFilters(state.filteredData, state.filterValues);
      setState((prev) => ({ ...prev, filteredData: filtered }));
    }
  }, [
    state.filterValues,
    state.filteredData,
    applyFilters,
    serverSideFiltering,
  ]);

  // Default filters if none provided
  const defaultFilters: FilterDefinition[] = [
    {
      type: "input",
      key: "date",
      props: {
        placeholder: "Filter by date...",
        ariaLabel: "Filter by date",
      },
    },
    {
      type: "single-select",
      key: "user",
      props: {
        placeholder: "Filter by user",
        options: Array.from(
          new Set(state.filteredData.map((entry) => entry.user))
        ).map((user) => ({ value: user, label: user })),
      },
    },
    {
      type: "single-select",
      key: "action",
      props: {
        placeholder: "Filter by action",
        options: Array.from(
          new Set(state.filteredData.map((entry) => entry.actionPerformed))
        ).map((action) => ({ value: action, label: action })),
      },
    },
    {
      type: "input",
      key: "field",
      props: {
        placeholder: "Filter by field name...",
        ariaLabel: "Filter by field name",
      },
    },
  ];

  const filtersToUse = filters.length > 0 ? filters : defaultFilters;

  // Format field value for display
  const formatFieldValue = (value: unknown): string => {
    if (value === null) return "null";
    if (value === undefined) return "undefined";
    if (typeof value === "boolean") return value ? "true" : "false";
    return String(value);
  };

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

  return (
    <div className={cn("space-y-4", className)}>
      {/* Filter Controls */}
      <div className="border-b pb-4">
        <FilterBar
          filters={filtersToUse}
          values={state.filterValues}
          onChange={handleFilterChange}
          onClearAll={handleClearAll}
          showClearAll={Object.keys(state.filterValues).length > 0}
          direction="horizontal"
          gap="gap-4"
        />
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
                    <Button onClick={() => toggleRowExpansion(entry.id)} variant="outline" size="icon-sm">
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
                          <th className="p-2 text-left font-medium">
                            Before
                          </th>
                          <th className="p-2 text-left font-medium">
                            After
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {entry.fieldChanges.map((change, index) => (
                          <tr
                            key={index}
                            className="border-b last:border-0"
                          >
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
                        ))}
                      </tbody>
                    </table>
                  </TableCell>
                </TableRow>
              )}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </div >
  );
}
