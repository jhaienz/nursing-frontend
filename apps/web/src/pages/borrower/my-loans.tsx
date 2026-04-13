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
import { Link } from "react-router-dom"
import { ChevronLeft } from "lucide-react"

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
  const [username, setUsername] = useState("")
  const [submittedUsername, setSubmittedUsername] = useState("")

  const { data: loans, isLoading } = useLoansByBorrower(submittedUsername)

  return (
    <div className="space-y-6 px-6">
      <div className="flex items-center gap-4">
        <Link to="/borrower">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">My Loans</h1>
      </div>

      {/* Username lookup */}
      <Card>
        <CardHeader>
          <CardTitle>Look Up Your Loans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && setSubmittedUsername(username)
              }
              className="max-w-sm"
            />
            <Button onClick={() => setSubmittedUsername(username)}>
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loans Table */}
      {submittedUsername && (
        <Card>
          <CardHeader>
            <CardTitle>Loans for {submittedUsername}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : loans?.length === 0 ? (
              <p className="text-sm text-muted-foreground">No loans found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
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
      <TableCell>{loan.quantity}</TableCell>
      <TableCell>
        {loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : "-"}
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
