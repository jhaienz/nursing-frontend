import { useParams, Link } from "react-router-dom"
import { useItem } from "@/lib/hooks/use-items"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { ChevronLeft } from "lucide-react"

export function ItemDetail() {
  const { id } = useParams<{ id: string }>()
  const itemId = id ? parseInt(id) : 0
  const { data: item, isLoading, error } = useItem(itemId)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Link to="/borrower">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !item) {
    return (
      <div className="space-y-6">
        <Link to="/borrower">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Failed to load item details</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link to="/borrower">
        <Button variant="ghost" size="sm">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </Link>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{item.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="font-medium">{item.category}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Item Type</p>
              <p className="font-medium">
                {item.isReturnable ? "Equipment (Returnable)" : "Consumable"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Quantity</p>
              <p className="font-medium">{item.quantity} units</p>
            </div>
            {item.availability && (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Available Units</p>
                  <p className="font-medium text-green-600">
                    {item.availability.availableUnits} units
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Loans</p>
                  <p className="font-medium">{item.availability.activeLoans.length}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {item.isReturnable ? "Request Equipment" : "Request Consumable"}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8 gap-4">
            {/* Equipment: available only if availableUnits > 0
                Consumable: available as long as quantity > 0 (no availability block from API) */}
            {(item.isReturnable
              ? (item.availability?.availableUnits ?? 0) > 0
              : item.quantity > 0) ? (
              <>
                {item.isReturnable && item.availability && (
                  <p className="text-sm text-muted-foreground">
                    {item.availability.availableUnits} of {item.availability.totalUnits} units available
                  </p>
                )}
                {!item.isReturnable && (
                  <p className="text-sm text-muted-foreground">
                    {item.quantity} units in stock
                  </p>
                )}
                <Link to={`/borrower/request-loan/${item.id}`} className="w-full">
                  <Button className="w-full" size="lg">
                    Request This Item
                  </Button>
                </Link>
              </>
            ) : (
              <div className="text-center space-y-1">
                <p className="font-medium">Out of stock</p>
                <p className="text-sm text-muted-foreground">
                  {item.isReturnable
                    ? "All units are currently on loan."
                    : "No stock remaining."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Active Loans */}
      {item.availability && item.availability.activeLoans.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {item.availability.activeLoans.map((loan) => (
                <div
                  key={loan.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium">{loan.borrower.fullName}</p>
                    <p className="text-sm text-muted-foreground">
                      {loan.quantity} unit{loan.quantity > 1 ? "s" : ""} · Due{" "}
                      {new Date(loan.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
