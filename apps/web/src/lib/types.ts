// Auth
export type AuthResponse = {
  access_token: string
}

// Admins
export type Admin = {
  id: number
  username: string
  createdAt: string
}

// Borrowers — field names match Prisma model (camelCase), not DB column names
export type Borrower = {
  id: number
  username: string
  fullName: string
  isBlocked: boolean     // Prisma: isBlocked @map("is_blocked")
  createdAt: string
}

// Items
export type Item = {
  id: number
  name: string
  category: string
  isReturnable: boolean  // Prisma: isReturnable @map("is_returnable")
  quantity: number
  availability?: {
    totalUnits: number
    availableUnits: number
    activeLoans: Array<{
      id: number
      quantity: number
      dueDate: string
      borrower: { username: string; fullName: string }
    }>
  }
}

// BorrowedItem status — matches enum BorrowedItemStatus in schema
export const LoanStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  COMPLETED: "COMPLETED",
  RETURNED: "RETURNED",
  OVERDUE: "OVERDUE",
} as const

export type LoanStatus = (typeof LoanStatus)[keyof typeof LoanStatus]

// BorrowedItem (exposed as /loans in API)
export type Loan = {
  id: number
  status: LoanStatus
  quantity: number
  dueDate?: string        // Prisma: dueDate @map("due_date")
  returnedAt?: string     // Prisma: returnedAt @map("returned_at")
  createdAt: string
  borrower: { id: number; username: string; fullName: string }
  item: { id: number; name: string; category: string; isReturnable: boolean }
  admin?: { id: number; username: string } | null
  penalty?: Penalty | null
}

// Penalty status — matches enum PenaltyStatus in schema
export const PenaltyStatus = {
  UNPAID: "UNPAID",
  CLEARED: "CLEARED",
} as const

export type PenaltyStatus = (typeof PenaltyStatus)[keyof typeof PenaltyStatus]

// Penalty — no `amount` field in schema; relation is `borrowedItem` not `loan`
export type Penalty = {
  id: number
  status: PenaltyStatus
  issuedAt: string        // Prisma: issuedAt @map("issued_at")
  clearedAt?: string      // Prisma: clearedAt @map("cleared_at")
  borrower: Pick<Borrower, "id" | "username" | "fullName" | "isBlocked">
  borrowedItem: Pick<Loan, "id" | "status" | "dueDate" | "quantity"> & {
    item: { name: string }
  }
}
