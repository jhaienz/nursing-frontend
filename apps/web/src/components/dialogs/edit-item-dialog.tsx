import { useState, useEffect } from "react"
import { useUpdateItem } from "@/lib/hooks/use-items"
import type { Item } from "@/lib/types"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"

type Props = {
  item: Item
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditItemDialog({ item, open, onOpenChange }: Props) {
  const { mutate: updateItem, isPending } = useUpdateItem(item.id)
  const [form, setForm] = useState({
    name: item.name,
    category: item.category,
    quantity: item.quantity,
  })
  const [error, setError] = useState("")

  // Sync form when the item prop changes (e.g. opening for a different item)
  useEffect(() => {
    setForm({ name: item.name, category: item.category, quantity: item.quantity })
    setError("")
  }, [item])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.quantity < 0) {
      setError("Quantity must be 0 or greater")
      return
    }
    setError("")
    updateItem(
      { name: form.name, category: form.category, quantity: form.quantity },
      {
        onSuccess: () => onOpenChange(false),
        onError: (err: unknown) => {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message
          setError(msg || "Failed to update item")
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
          <DialogDescription>
            Update inventory details. Item type cannot be changed after creation.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="edit-item-name">Name</Label>
            <Input
              id="edit-item-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-item-category">Category</Label>
            <Input
              id="edit-item-category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-item-qty">Quantity</Label>
            <Input
              id="edit-item-qty"
              type="number"
              min="0"
              value={form.quantity}
              onChange={(e) =>
                setForm({ ...form, quantity: parseInt(e.target.value, 10) || 0 })
              }
              required
            />
          </div>
          <div className="rounded-md bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
            Type: {item.isReturnable ? "Equipment (Returnable)" : "Consumable"}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
