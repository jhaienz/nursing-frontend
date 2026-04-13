import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { useBorrowers } from "@/lib/hooks/use-borrowers"
import { useLoans } from "@/lib/hooks/use-loans"
import { useItems } from "@/lib/hooks/use-items"
import { usePenalties } from "@/lib/hooks/use-penalties"
import { LoanStatus, PenaltyStatus } from "@/lib/types"
import { Skeleton } from "@workspace/ui/components/skeleton"

export function AdminDashboard() {
  const { data: borrowers, isLoading: borrowersLoading } = useBorrowers()
  const { data: loans, isLoading: loansLoading } = useLoans()
  const { data: items, isLoading: itemsLoading } = useItems()
  const { data: penalties, isLoading: penaltiesLoading } = usePenalties()

  const pendingLoans = loans?.filter((l) => l.status === LoanStatus.PENDING).length || 0
  const overdueLoans = loans?.filter((l) => l.status === LoanStatus.OVERDUE).length || 0
  const unpaidPenalties =
    penalties?.filter((p) => p.status === PenaltyStatus.UNPAID).length || 0

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Borrowers</CardTitle>
          </CardHeader>
          <CardContent>
            {borrowersLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <div className="text-2xl font-bold">{borrowers?.length || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending Loans</CardTitle>
          </CardHeader>
          <CardContent>
            {loansLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <div className="text-2xl font-bold text-amber-600">{pendingLoans}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Overdue Loans</CardTitle>
          </CardHeader>
          <CardContent>
            {loansLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <div className="text-2xl font-bold text-red-600">{overdueLoans}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Unpaid Penalties</CardTitle>
          </CardHeader>
          <CardContent>
            {penaltiesLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <div className="text-2xl font-bold text-destructive">
                {unpaidPenalties}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Inventory Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {itemsLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              <p>Total Items: {items?.length || 0}</p>
              <p>Equipment: {items?.filter((i) => i.isReturnable).length || 0}</p>
              <p>Consumables: {items?.filter((i) => !i.isReturnable).length || 0}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
