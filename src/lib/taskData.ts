import type { Column, Task, User } from "./types";

export const users: User[] = [
  { id: "user-1", name: "Alice", avatar: "/avatars/01.png" },
  { id: "user-2", name: "Bob", avatar: "/avatars/02.png" },
  { id: "user-3", name: "Charlie", avatar: "/avatars/03.png" },
  { id: "user-4", name: "David", avatar: "/avatars/04.png" },
  { id: "user-5", name: "Eve", avatar: "/avatars/05.png" },
];

export const initialTasks: Task[] = [
  {
    id: "1",
    columnId: "todo",
    content: "Analyze project requirements",
    priority: "high",
    tags: ["feature"],
    assignees: [users[0]],
    createdAt: "2024-07-20T10:00:00Z",
    dueDate: "2024-07-28T18:00:00Z",
    timeEstimate: 8,
    comments: [
      {
        id: "c1",
        author: users[0],
        text: "We need to finalize the scope with the client.",
        timestamp: "2024-07-20T11:30:00Z",
      },
    ],
  },
  {
    id: "2",
    columnId: "todo",
    content: "Create wireframes and mockups for all major screens",
    priority: "medium",
    tags: ["ui"],
    assignees: [users[1], users[4]],
    createdAt: "2024-07-21T09:00:00Z",
  },
  {
    id: "3",
    columnId: "inprogress",
    content: "Set up development environment and scaffold the Next.js app",
    priority: "high",
    tags: ["feature"],
    assignees: [users[2]],
    createdAt: "2024-07-22T14:00:00Z",
    timeEstimate: 4,
  },
  {
    id: "4",
    columnId: "inprogress",
    content: "Develop main Kanban board UI components",
    priority: "medium",
    tags: ["ui"],
    assignees: [users[3], users[0]],
    createdAt: "2024-07-23T16:00:00Z",
    dueDate: "2024-07-30T18:00:00Z",
    timeEstimate: 12,
    comments: [
      {
        id: "c2",
        author: users[1],
        text: "Let's use ShadCN for the components.",
        timestamp: "2024-07-23T17:00:00Z",
      },
      {
        id: "c3",
        author: users[2],
        text: "Drag and drop is a must-have.",
        timestamp: "2024-07-24T09:00:00Z",
      },
    ],
  },
  {
    id: "5",
    columnId: "done",
    content: "Choose tech stack and libraries",
    priority: "low",
    assignees: [users[0]],
    createdAt: "2024-07-19T11:00:00Z",
  },
  {
    id: "6",
    columnId: "done",
    content: "Finalize color scheme and typography",
    priority: "low",
    tags: ["ui", "docs"],
    assignees: [users[4]],
    createdAt: "2024-07-18T15:00:00Z",
  },
];

export const initialColumns: Column[] = [
  {
    id: "todo",
    title: "To Do",
  },
  {
    id: "inprogress",
    title: "In Progress",
  },
  {
    id: "done",
    title: "Done",
  },
];
