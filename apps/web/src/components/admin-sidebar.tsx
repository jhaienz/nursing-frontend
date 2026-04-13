import { Link, useLocation } from "react-router-dom"
import { Button } from "@workspace/ui/components/button"
import { useAuthStore } from "@/lib/auth"
import { LogOut, LayoutDashboard, Users, Package, FileText, AlertCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { cn } from "@workspace/ui/lib/utils"

export function AdminSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate("/admin/login")
  }

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/borrowers", label: "Borrowers", icon: Users },
    { href: "/admin/items", label: "Inventory", icon: Package },
    { href: "/admin/loans", label: "Loans", icon: FileText },
    { href: "/admin/penalties", label: "Penalties", icon: AlertCircle },
  ]

  return (
    <aside className="w-64 border-r border-border bg-background">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="border-b border-border px-6 py-6">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <p className="mt-2 text-sm text-muted-foreground">{user?.username}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 px-3 py-6">
          {links.map(({ href, label, icon: Icon }) => (
            <Link key={href} to={href}>
              <Button
                variant={location.pathname === href ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  location.pathname === href && "bg-primary text-primary-foreground"
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                {label}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-border px-3 py-6">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  )
}
