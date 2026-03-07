import { FilterDefinition } from "@/components/ui/filter"

export interface FieldChange {
  fieldName: string
  beforeValue: string | number | boolean | null
  afterValue: string | number | boolean | null
}

export interface ActionEntry {
  id: string
  datetime: Date | string
  stateBefore: string
  stateAfter: string
  actionPerformed: string
  numberOfFields: number
  fieldChanges: FieldChange[]
  user: string
  [key: string]: unknown // Allow additional properties
}

export type DataFetchFunction = (
  filters: Record<string, unknown>
) => ActionEntry[] | Promise<ActionEntry[]>

export interface FilterTableProps {
  data: ActionEntry[] | DataFetchFunction
  filters?: FilterDefinition[]
  defaultExpanded?: boolean
  showFieldChanges?: boolean
  dateFormat?: string
  emptyStateMessage?: string
  className?: string
  onRowExpand?: (entry: ActionEntry, isExpanded: boolean) => void
  onFilterChange?: (filters: Record<string, unknown>) => void
  // If true, will call data function with filters on filter change
  // If false, will filter client-side data
  serverSideFiltering?: boolean
  // Debounce time for filter changes when using server-side filtering
  debounceTime?: number
}

export interface FilterTableState {
  expandedRows: Set<string>
  filterValues: Record<string, unknown>
  filteredData: ActionEntry[]
  isLoading: boolean
  error: Error | null
}
