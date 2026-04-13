import { useState } from "react"
import { useBorrowers, useDeleteBorrower } from "@/lib/hooks/use-borrowers"
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
import { CreateBorrowerDialog } from "@/components/dialogs/create-borrower-dialog"
import { EditBorrowerDialog } from "@/components/dialogs/edit-borrower-dialog"
import type { Borrower } from "@/lib/types"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Trash2, Edit2 } from "lucide-react"

export function BorrowersPage() {
  const { data: borrowers, isLoading } = useBorrowers()
  const { mutate: deleteBorrower } = useDeleteBorrower()
  const [openCreate, setOpenCreate] = useState(false)
  const [editingBorrower, setEditingBorrower] = useState<Borrower | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Borrowers</h1>
        <Button onClick={() => setOpenCreate(true)}>Create Borrower</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Borrowers</CardTitle>
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
                  <TableHead>Username</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {borrowers?.map((borrower) => (
                  <TableRow key={borrower.id}>
                    <TableCell className="font-medium">{borrower.username}</TableCell>
                    <TableCell>{borrower.fullName}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                          borrower.isBlocked
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {borrower.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(borrower.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingBorrower(borrower)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteBorrower(borrower.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <CreateBorrowerDialog open={openCreate} onOpenChange={setOpenCreate} />
      {editingBorrower && (
        <EditBorrowerDialog
          borrower={editingBorrower}
          open={!!editingBorrower}
          onOpenChange={(open) => !open && setEditingBorrower(null)}
        />
      )}
    </div>
  )
}
