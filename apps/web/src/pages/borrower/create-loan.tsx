import { useParams } from "react-router-dom"
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
import { Link } from "react-router-dom"
import { CheckCircle, ChevronLeft } from "lucide-react"

const loanSchema = z.object({
  username: z.string().min(1, "Username is required"),
  pin: z.string().min(4, "PIN must be at least 4 characters").max(8),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  dueDate: z.string().optional(),
})

type LoanFormValues = z.infer<typeof loanSchema>

type SuccessInfo = {
  itemName: string
  quantity: number
}

export function CreateLoanRequest() {
  const { itemId } = useParams<{ itemId: string }>()
  const id = itemId ? parseInt(itemId) : 0
  const { data: item, isLoading } = useItem(id)
  const { mutate: createLoan, isPending } = useCreateLoan()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState<SuccessInfo | null>(null)

  const form = useForm<LoanFormValues>({
    resolver: zodResolver(loanSchema),
    defaultValues: { quantity: 1 },
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
          setSuccess({ itemName: item?.name ?? "", quantity: values.quantity })
          form.reset()
        },
        onError: (err: any) => {
          const status = err.response?.status
          const message = err.response?.data?.message
          if (status === 401) {
            setError("Incorrect username or PIN. Please check your credentials and try again.")
          } else if (status === 403) {
            setError("Your account is currently blocked. Please contact an administrator.")
          } else if (Array.isArray(message)) {
            setError(message.join(", "))
          } else {
            setError(message || "Failed to submit request. Please try again.")
          }
        },
      }
    )
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 px-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    )
  }

  if (!item) {
    return (
      <div className="mx-auto max-w-2xl px-4">
        <p className="text-muted-foreground">Item not found.</p>
      </div>
    )
  }

  // ── Success state ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 px-4">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <CheckCircle className="h-14 w-14 text-green-500" />
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">Request Submitted!</h2>
              <p className="text-muted-foreground">
                Your request for{" "}
                <span className="font-medium text-foreground">
                  {success.quantity} × {success.itemName}
                </span>{" "}
                has been received and is now{" "}
                <span className="font-semibold text-amber-600">pending approval</span>.
              </p>
            </div>
            <p className="max-w-sm text-sm text-muted-foreground">
              An administrator will review your request shortly. You can check the
              status of your loans at any time using your username.
            </p>
            <div className="flex gap-3 pt-2">
              <Link to="/borrower/my-loans">
                <Button variant="outline">View My Loans</Button>
              </Link>
              <Link to="/borrower">
                <Button>Back to Catalog</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4">
      <div className="flex items-center gap-3">
        <Link to={`/borrower/items/${id}`}>
          <Button variant="ghost" size="sm">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Request Equipment</h1>
      </div>

      {/* Item summary */}
      <Card>
        <CardHeader>
          <CardTitle>{item.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{item.category}</p>
        </CardHeader>
        <CardContent className="space-y-1">
          <p className="text-sm">
            <span className="font-medium">Type:</span>{" "}
            {item.isReturnable ? "Equipment (must be returned)" : "Consumable"}
          </p>
          <p className="text-sm">
            <span className="font-medium">Available:</span>{" "}
            {item.isReturnable
              ? (item.availability?.availableUnits ?? 0)
              : item.quantity}{" "}
            units
          </p>
        </CardContent>
      </Card>

      {/* Request form */}
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
                      <Input type="password" placeholder="4–8 digit PIN" {...field} />
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
                        max={
                          item.isReturnable
                            ? (item.availability?.availableUnits ?? item.quantity)
                            : item.quantity
                        }
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
                {isPending ? "Submitting..." : "Submit Request"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
