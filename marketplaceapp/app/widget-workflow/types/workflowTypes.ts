export interface WorkflowState {
  id: string
  name: string
}

export interface WorkflowItem {
  id: string
  itemId: string
  itemName: string
  version: number
  state: string
  stateName: string
  enteredStateDate: string // ISO date string
  path: string
  templateId: string
  templateName: string
  language: string
  workflowId: string
  workflowName: string
}

export interface WorkflowThreshold {
  days: number
  hours: number
}

export interface FilterOptions {
  workflowStates: string[]
  threshold: WorkflowThreshold
}
