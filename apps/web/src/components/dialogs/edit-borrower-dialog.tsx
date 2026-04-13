import { useState } from "react"
import { useUpdateBorrower } from "@/lib/hooks/use-borrowers"
import type { Borrower } from "@/lib/types"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"

const editBorrowerSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  isBlocked: z.string(),
})

type EditBorrowerFormValues = z.infer<typeof editBorrowerSchema>

export function EditBorrowerDialog({
  borrower,
  open,
  onOpenChange,
}: {
  borrower: Borrower
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [error, setError] = useState("")
  const { mutate: updateBorrower, isPending } = useUpdateBorrower(borrower.id)

  const form = useForm<EditBorrowerFormValues>({
    resolver: zodResolver(editBorrowerSchema),
    defaultValues: {
      fullName: borrower.fullName,
      isBlocked: borrower.isBlocked ? "true" : "false",
    },
  })

  function onSubmit(values: EditBorrowerFormValues) {
    setError("")
    updateBorrower(
      {
        fullName: values.fullName,
        isBlocked: values.isBlocked === "true",
      },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
        onError: (err: any) => {
          setError(err.response?.data?.message || "Failed to update borrower")
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Borrower</DialogTitle>
          <DialogDescription>Update borrower information</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isBlocked"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select value={field.value} onValueChange={(val) => field.onChange(val ?? field.value)}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="false">Active</SelectItem>
                      <SelectItem value="true">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Updating..." : "Update"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
