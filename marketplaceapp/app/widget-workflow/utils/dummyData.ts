import { WorkflowState, WorkflowItem } from "../types/workflowTypes"

export function generateDummyWorkflowStates(): WorkflowState[] {
  return [
    { id: "{A5BC37E7-ED96-4C0E-9659-4A55B26A993D}", name: "Draft" },
    { id: "{D87B2F1A-0E5C-4C8D-9E0F-6C7A1B2C3D4E}", name: "Awaiting Review" },
    { id: "{C3D5E7F9-1A2B-4C3D-8E9F-0A1B2C3D4E5F}", name: "In Review" },
    { id: "{F1E2D3C4-B5A6-4C3D-9E8F-7A6B5C4D3E2F}", name: "Approved" },
    {
      id: "{E4F5G6H7-I8J9-4K5L-9M8N-7O6P5Q4R3S2T}",
      name: "Ready for Publishing",
    },
  ]
}

export function generateDummyWorkflowItems(): WorkflowItem[] {
  const states = generateDummyWorkflowStates()
  const workflows = [
    {
      id: "{A1B2C3D4-E5F6-4A5B-8C9D-E0F1A2B3C4D5}",
      name: "Content Approval Workflow",
    },
    {
      id: "{B2C3D4E5-F6A7-4B5C-8D9E-F0A1B2C3D4E5}",
      name: "Product Publishing Workflow",
    },
    {
      id: "{C3D4E5F6-A7B8-4C5D-8E9F-0A1B2C3D4E5F}",
      name: "Editorial Workflow",
    },
  ]
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

  const items: WorkflowItem[] = []
  const now = new Date()

  // Generate items for the last 90 days
  for (let i = 0; i < 90; i++) {
    const date = new Date(now)
    date.setDate(now.getDate() - i)

    // Generate 1-5 items per day
    const itemsToday = 1 + Math.floor(Math.random() * 5)

    for (let j = 0; j < itemsToday; j++) {
      const template = templates[Math.floor(Math.random() * templates.length)]
      const language = languages[Math.floor(Math.random() * languages.length)]
      const path = paths[Math.floor(Math.random() * paths.length)]
      const state = states[Math.floor(Math.random() * states.length)]
      const workflow = workflows[Math.floor(Math.random() * workflows.length)]

      // Create entered state date (1-30 days ago from current date in loop)
      const enteredStateDate = new Date(date)
      enteredStateDate.setHours(
        9 + Math.floor(Math.random() * 8),
        Math.floor(Math.random() * 60)
      )

      items.push({
        id: `workflow-item-${i}-${j}`,
        itemId: `item-${i}-${j}`,
        itemName: `Sample Item ${i}-${j}`,
        version: 1 + Math.floor(Math.random() * 3),
        state: state.id,
        stateName: state.name,
        enteredStateDate: enteredStateDate.toISOString(),
        path: path,
        templateId: template.id,
        templateName: template.name,
        language: language,
        workflowId: workflow.id,
        workflowName: workflow.name,
      })
    }
  }

  return items
}

export function calculateDaysInState(enteredStateDate: string): number {
  const enteredDate = new Date(enteredStateDate)
  const now = new Date()
  const diffInMs = now.getTime() - enteredDate.getTime()
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24))
}

export function calculateHoursInState(enteredStateDate: string): number {
  const enteredDate = new Date(enteredStateDate)
  const now = new Date()
  const diffInMs = now.getTime() - enteredDate.getTime()
  return Math.floor(diffInMs / (1000 * 60 * 60)) % 24
}
