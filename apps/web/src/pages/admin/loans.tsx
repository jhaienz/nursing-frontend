import { useLoans, useApproveLoan, useRejectLoan } from "@/lib/hooks/use-loans"
import { Button } from "@workspace/ui/components/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { LoanStatus } from "@/lib/types"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Badge } from "@workspace/ui/components/badge"

export function LoansPage() {
  const { data: loans, isLoading } = useLoans()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Loan Requests</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Loans</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Borrower</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loans?.map((loan) => (
                  <LoanTableRow key={loan.id} loan={loan} />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function LoanTableRow({ loan }: { loan: any }) {
  const { mutate: approve, isPending: approving } = useApproveLoan(loan.id)
  const { mutate: reject, isPending: rejecting } = useRejectLoan(loan.id)

  const getStatusBadgeVariant = (status: LoanStatus) => {
    switch (status) {
      case LoanStatus.PENDING:
        return "outline"
      case LoanStatus.APPROVED:
        return "default"
      case LoanStatus.RETURNED:
        return "secondary"
      case LoanStatus.OVERDUE:
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <TableRow>
      <TableCell className="font-medium">{loan.borrower.fullName}</TableCell>
      <TableCell>{loan.item.name}</TableCell>
      <TableCell>{loan.quantity}</TableCell>
      <TableCell>
        {loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : "-"}
      </TableCell>
      <TableCell>
        <Badge variant={getStatusBadgeVariant(loan.status)}>
          {loan.status}
        </Badge>
      </TableCell>
      <TableCell className="flex gap-2">
        {loan.status === LoanStatus.PENDING && (
          <>
            <Button
              size="sm"
              onClick={() => approve()}
              disabled={approving || rejecting}
            >
              {approving ? "..." : "Approve"}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => reject()}
              disabled={approving || rejecting}
            >
              {rejecting ? "..." : "Reject"}
            </Button>
          </>
        )}
      </TableCell>
    </TableRow>
  )
}
