import { useState } from "react"
import { useLoansByBorrower, useReturnLoan } from "@/lib/hooks/use-loans"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { Badge } from "@workspace/ui/components/badge"
import { Input } from "@workspace/ui/components/input"
import { LoanStatus, type Loan } from "@/lib/types"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Search } from "lucide-react"

const STATUS_VARIANT: Record<
  LoanStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  [LoanStatus.PENDING]: "outline",
  [LoanStatus.APPROVED]: "default",
  [LoanStatus.RETURNED]: "secondary",
  [LoanStatus.COMPLETED]: "secondary",
  [LoanStatus.OVERDUE]: "destructive",
  [LoanStatus.REJECTED]: "destructive",
}

export function MyLoans() {
  const [input, setInput] = useState("")
  const [submittedUsername, setSubmittedUsername] = useState("")

  const {
    data: loans,
    isLoading,
    isError,
    isFetched,
  } = useLoansByBorrower(submittedUsername)

  function handleSearch() {
    const trimmed = input.trim()
    if (trimmed) setSubmittedUsername(trimmed)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Loans</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your username to look up your loan history and status.
        </p>
      </div>

      {/* Lookup card */}
      <Card>
        <CardHeader>
          <CardTitle>Look Up Your Loans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="Enter your username"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="max-w-sm"
            />
            <Button onClick={handleSearch} disabled={!input.trim()}>
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {submittedUsername && (
        <Card>
          <CardHeader>
            <CardTitle>
              Loans for{" "}
              <span className="font-mono text-primary">@{submittedUsername}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : isError ? (
              <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
                Failed to load loans. Please try again.
              </div>
            ) : isFetched && (!loans || loans.length === 0) ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No loans found for <span className="font-medium">@{submittedUsername}</span>.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loans?.map((loan) => (
                    <LoanRow key={loan.id} loan={loan} />
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function LoanRow({ loan }: { loan: Loan }) {
  const { mutate: returnItem, isPending } = useReturnLoan(loan.id)

  return (
    <TableRow>
      <TableCell className="font-medium">{loan.item.name}</TableCell>
      <TableCell className="text-muted-foreground">
        {loan.item.isReturnable ? "Equipment" : "Consumable"}
      </TableCell>
      <TableCell>{loan.quantity}</TableCell>
      <TableCell>
        {loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : "—"}
      </TableCell>
      <TableCell>
        <Badge variant={STATUS_VARIANT[loan.status]}>{loan.status}</Badge>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {new Date(loan.createdAt).toLocaleDateString()}
      </TableCell>
      <TableCell>
        {loan.status === LoanStatus.APPROVED && loan.item.isReturnable && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => returnItem()}
            disabled={isPending}
          >
            {isPending ? "..." : "Return"}
          </Button>
        )}
      </TableCell>
    </TableRow>
  )
}
