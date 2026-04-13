import { useState } from "react"
import { useItems } from "@/lib/hooks/use-items"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Link } from "react-router-dom"
import { Skeleton } from "@workspace/ui/components/skeleton"

export function BorrowerPortal() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<string | undefined>()
  const [itemType, setItemType] = useState<string | undefined>()

  const { data: items, isLoading } = useItems({
    search: search || undefined,
    category: category || undefined,
    isReturnable: itemType === "equipment" ? true : itemType === "consumable" ? false : undefined,
  })

  const categories = Array.from(
    new Set(items?.map((item) => item.category) || [])
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Equipment Catalog</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse available equipment and consumables. Click any item to request it.
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1">
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Search items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <Select value={category || ""} onValueChange={(val) => setCategory(val ?? undefined)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Type</label>
              <Select value={itemType || ""} onValueChange={(val) => setItemType(val ?? undefined)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All types</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                  <SelectItem value="consumable">Consumable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? [...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))
          : items?.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{item.category}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium">
                      {item.isReturnable ? "Equipment" : "Consumable"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Available</p>
                    <p className="font-medium">
                      {item.availability?.availableUnits || item.quantity} units
                    </p>
                  </div>
                  <Link to={`/borrower/items/${item.id}`}>
                    <Button className="w-full">Request</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  )
}
