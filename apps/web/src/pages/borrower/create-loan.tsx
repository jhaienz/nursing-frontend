import { useParams, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useItem } from "@/lib/hooks/use-items"
import { useCreateLoan } from "@/lib/hooks/use-loans"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { Skeleton } from "@workspace/ui/components/skeleton"

const loanSchema = z.object({
  username: z.string().min(1, "Username is required"),
  pin: z.string().min(4, "PIN must be at least 4 characters").max(8),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  dueDate: z.string().optional(),
})

type LoanFormValues = z.infer<typeof loanSchema>

export function CreateLoanRequest() {
  const { itemId } = useParams<{ itemId: string }>()
  const id = itemId ? parseInt(itemId) : 0
  const { data: item, isLoading } = useItem(id)
  const { mutate: createLoan, isPending } = useCreateLoan()
  const navigate = useNavigate()
  const [error, setError] = useState("")

  const form = useForm<LoanFormValues>({
    resolver: zodResolver(loanSchema),
    defaultValues: {
      quantity: 1,
    },
  })

  function onSubmit(values: LoanFormValues) {
    setError("")
    createLoan(
      {
        username: values.username,
        pin: values.pin,
        itemId: id,
        quantity: values.quantity,
        dueDate: item?.isReturnable ? values.dueDate : undefined,
      },
      {
        onSuccess: () => {
          navigate("/borrower/my-loans")
        },
        onError: (err: any) => {
          setError(err.response?.data?.message || "Failed to create request")
        },
      }
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    )
  }

  if (!item) {
    return <div>Item not found</div>
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">Request Equipment</h1>

      <Card>
        <CardHeader>
          <CardTitle>{item.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{item.category}</p>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">
            <span className="font-medium">Type:</span>{" "}
            {item.isReturnable ? "Equipment (must be returned)" : "Consumable"}
          </p>
          <p className="text-sm">
            <span className="font-medium">Available:</span>{" "}
            {item.availability?.availableUnits || 0} units
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Request Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Your username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PIN</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="4-8 digit PIN"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max={item.availability?.availableUnits || item.quantity}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {item.isReturnable && (
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Creating request..." : "Create Request"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
