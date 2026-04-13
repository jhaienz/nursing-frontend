import { Outlet } from "react-router-dom"
import { AdminSidebar } from "@/components/admin-sidebar"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@workspace/ui/components/button"
import { Moon, Sun } from "lucide-react"

export function AdminLayout() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex h-screen w-full">
      <AdminSidebar />
      <main className="flex flex-1 flex-col">
        <header className="border-b bg-background px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Nursing Equipment Management</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setTheme(theme === "dark" ? "light" : "dark")
              }
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </header>
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}
