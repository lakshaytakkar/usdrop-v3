import { InternalUser } from "@/types/admin/users"

export const sampleInternalUsers: InternalUser[] = [
  {
    id: "int_001",
    name: "John Smith",
    email: "john.smith@usdrop.com",
    role: "admin",
    status: "active",
    createdAt: new Date("2024-01-15T10:00:00Z"),
    updatedAt: new Date("2024-01-20T14:30:00Z"),
  },
  {
    id: "int_002",
    name: "Sarah Johnson",
    email: "sarah.johnson@usdrop.com",
    role: "manager",
    status: "active",
    createdAt: new Date("2024-01-10T09:00:00Z"),
    updatedAt: new Date("2024-01-18T11:20:00Z"),
  },
  {
    id: "int_003",
    name: "Michael Chen",
    email: "michael.chen@usdrop.com",
    role: "executive",
    status: "active",
    createdAt: new Date("2024-01-08T08:00:00Z"),
    updatedAt: new Date("2024-01-19T16:45:00Z"),
  },
  {
    id: "int_004",
    name: "Emily Davis",
    email: "emily.davis@usdrop.com",
    role: "manager",
    status: "inactive",
    createdAt: new Date("2023-12-20T10:00:00Z"),
    updatedAt: new Date("2024-01-15T10:00:00Z"),
  },
  {
    id: "int_005",
    name: "David Wilson",
    email: "david.wilson@usdrop.com",
    role: "admin",
    status: "active",
    createdAt: new Date("2024-01-05T12:00:00Z"),
    updatedAt: new Date("2024-01-17T13:15:00Z"),
  },
  {
    id: "int_006",
    name: "Lisa Anderson",
    email: "lisa.anderson@usdrop.com",
    role: "executive",
    status: "active",
    createdAt: new Date("2023-11-15T10:00:00Z"),
    updatedAt: new Date("2024-01-16T09:30:00Z"),
  },
]

