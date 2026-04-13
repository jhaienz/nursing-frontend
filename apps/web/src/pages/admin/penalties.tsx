import { usePenalties, useClearPenalty } from "@/lib/hooks/use-penalties"
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
import { PenaltyStatus, type Penalty } from "@/lib/types"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Badge } from "@workspace/ui/components/badge"

export function PenaltiesPage() {
  const { data: penalties, isLoading } = usePenalties()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Penalties</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Penalties</CardTitle>
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
                  <TableHead>Loan ID</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Issued</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {penalties?.map((penalty) => (
                  <PenaltyTableRow key={penalty.id} penalty={penalty} />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function PenaltyTableRow({ penalty }: { penalty: Penalty }) {
  const { mutate: clear, isPending } = useClearPenalty(penalty.id)

  return (
    <TableRow>
      <TableCell className="font-medium">{penalty.borrower.fullName}</TableCell>
      <TableCell>{penalty.borrowedItem.item.name}</TableCell>
      <TableCell>#{penalty.borrowedItem.id}</TableCell>
      <TableCell>
        {penalty.borrowedItem.dueDate
          ? new Date(penalty.borrowedItem.dueDate).toLocaleDateString()
          : "-"}
      </TableCell>
      <TableCell>{new Date(penalty.issuedAt).toLocaleDateString()}</TableCell>
      <TableCell>
        <Badge
          variant={
            penalty.status === PenaltyStatus.UNPAID ? "destructive" : "secondary"
          }
        >
          {penalty.status}
        </Badge>
      </TableCell>
      <TableCell>
        {penalty.status === PenaltyStatus.UNPAID && (
          <Button size="sm" onClick={() => clear()} disabled={isPending}>
            {isPending ? "..." : "Clear"}
          </Button>
        )}
      </TableCell>
    </TableRow>
  )
}
