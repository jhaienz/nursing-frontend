import { Outlet } from "react-router-dom"
import { Button } from "@workspace/ui/components/button"
import { useTheme } from "@/components/theme-provider"
import { Moon, Sun, LogOut } from "lucide-react"
import { useAuthStore } from "@/lib/auth"
import { useNavigate } from "react-router-dom"

export function PublicLayout() {
  const { theme, setTheme } = useTheme()
  const { logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/admin/login")
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <header className="border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Equipment Request Portal</h1>
          <div className="flex items-center gap-2">
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
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl py-8">
        <Outlet />
      </main>
    </div>
  )
}
