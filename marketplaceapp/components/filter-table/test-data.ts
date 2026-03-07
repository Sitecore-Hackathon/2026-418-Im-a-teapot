import type { ActionEntry } from "./types";

export const fetchDataWithFilters = async (filters: Record<string, unknown>) : Promise<ActionEntry[]> => {
  console.log("Fetching data with filters:", filters);
  // In a real app, this would be an API call
  // return await api.getActions(filters)

  // For demo purposes, filter the sample data
  if (Object.keys(filters).length === 0) {
    return sampleData;
  }

  return sampleData.filter((entry) => {
    if (filters.user && entry.user !== filters.user) return false;
    if (
      filters.action &&
      !entry.actionPerformed.includes(filters.action as string)
    )
      return false;
    return true;
  });
};

export const sampleData: ActionEntry[] = [
  {
    id: "1",
    datetime: new Date("2026-03-07T10:30:00"),
    stateBefore: "Draft",
    stateAfter: "Published",
    actionPerformed: "Publish Content",
    numberOfFields: 3,
    fieldChanges: [
      {
        fieldName: "title",
        beforeValue: "Old Title",
        afterValue: "New Title",
      },
      {
        fieldName: "status",
        beforeValue: "draft",
        afterValue: "published",
      },
      {
        fieldName: "publishDate",
        beforeValue: null,
        afterValue: "2026-03-07T10:30:00",
      },
    ],
    user: "admin",
  },
  {
    id: "2",
    datetime: new Date("2026-03-06T14:15:00"),
    stateBefore: "Review",
    stateAfter: "Approved",
    actionPerformed: "Approve Content",
    numberOfFields: 2,
    fieldChanges: [
      {
        fieldName: "approvalStatus",
        beforeValue: "pending",
        afterValue: "approved",
      },
      {
        fieldName: "approvedBy",
        beforeValue: null,
        afterValue: "reviewer1",
      },
    ],
    user: "reviewer1",
  },
  {
    id: "3",
    datetime: new Date("2026-03-05T09:45:00"),
    stateBefore: "New",
    stateAfter: "In Progress",
    actionPerformed: "Start Work",
    numberOfFields: 1,
    fieldChanges: [
      {
        fieldName: "workflowState",
        beforeValue: "new",
        afterValue: "in_progress",
      },
    ],
    user: "editor",
  },
];
