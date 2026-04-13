import { Outlet, NavLink } from "react-router-dom"
import { Button } from "@workspace/ui/components/button"
import { useTheme } from "@/components/theme-provider"
import { Moon, Sun, ClipboardList, Package } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

export function PublicLayout() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="min-h-screen w-full bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-6">
            <span className="text-lg font-bold">Equipment Portal</span>
            <nav className="flex items-center gap-1">
              <NavLink to="/borrower" end>
                {({ isActive }) => (
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(isActive && "font-semibold")}
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Catalog
                  </Button>
                )}
              </NavLink>
              <NavLink to="/borrower/my-loans">
                {({ isActive }) => (
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(isActive && "font-semibold")}
                  >
                    <ClipboardList className="mr-2 h-4 w-4" />
                    My Loans
                  </Button>
                )}
              </NavLink>
            </nav>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-7xl py-8 px-6">
        <Outlet />
      </main>
    </div>
  )
}
