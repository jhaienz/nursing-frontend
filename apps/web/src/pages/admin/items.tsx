import { useState } from "react"
import { useItems, useDeleteItem } from "@/lib/hooks/use-items"
import type { Item } from "@/lib/types"
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
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Trash2, Edit2 } from "lucide-react"
import { CreateItemDialog } from "@/components/dialogs/create-item-dialog"
import { EditItemDialog } from "@/components/dialogs/edit-item-dialog"
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog"

export function ItemsPage() {
  const { data: items, isLoading } = useItems()
  const { mutate: deleteItem, isPending: deleting } = useDeleteItem()

  const [openCreate, setOpenCreate] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [deletingItem, setDeletingItem] = useState<Item | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Inventory</h1>
        <Button onClick={() => setOpenCreate(true)}>Add Item</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Items</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : items?.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No items yet. Click "Add Item" to create one.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          item.isReturnable
                            ? "bg-blue-100 text-blue-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {item.isReturnable ? "Equipment" : "Consumable"}
                      </span>
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingItem(item)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeletingItem(item)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create dialog */}
      <CreateItemDialog open={openCreate} onOpenChange={setOpenCreate} />

      {/* Edit dialog */}
      {editingItem && (
        <EditItemDialog
          item={editingItem}
          open={!!editingItem}
          onOpenChange={(open) => !open && setEditingItem(null)}
        />
      )}

      {/* Delete confirmation dialog */}
      {deletingItem && (
        <ConfirmDialog
          open={!!deletingItem}
          onOpenChange={(open) => !open && setDeletingItem(null)}
          title="Delete Item"
          description={`Are you sure you want to delete "${deletingItem.name}"? This action cannot be undone.`}
          confirmLabel="Delete"
          isPending={deleting}
          onConfirm={() => deleteItem(deletingItem.id)}
        />
      )}
    </div>
  )
}
