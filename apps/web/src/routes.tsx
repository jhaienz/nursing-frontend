import type { ReactNode } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { useAuthStore } from "@/lib/auth"
import { AdminLayout } from "@/layouts/admin-layout"
import { PublicLayout } from "@/layouts/public-layout"

// Admin Pages
import { AdminLogin } from "@/pages/admin/login"
import { AdminDashboard } from "@/pages/admin/dashboard"
import { BorrowersPage } from "@/pages/admin/borrowers"
import { ItemsPage } from "@/pages/admin/items"
import { LoansPage } from "@/pages/admin/loans"
import { PenaltiesPage } from "@/pages/admin/penalties"

// Borrower Pages
import { BorrowerPortal } from "@/pages/borrower/portal"
import { ItemDetail } from "@/pages/borrower/item-detail"
import { CreateLoanRequest } from "@/pages/borrower/create-loan"
import { MyLoans } from "@/pages/borrower/my-loans"

function PrivateRoute({ children }: { children: ReactNode }) {
  const { token, user, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    )
  }

  if (!token || !user) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="borrowers" element={<BorrowersPage />} />
        <Route path="items" element={<ItemsPage />} />
        <Route path="loans" element={<LoansPage />} />
        <Route path="penalties" element={<PenaltiesPage />} />
      </Route>

      {/* Borrower Routes */}
      <Route path="/borrower" element={<PublicLayout />}>
        <Route index element={<BorrowerPortal />} />
        <Route path="items/:id" element={<ItemDetail />} />
        <Route path="request-loan/:itemId" element={<CreateLoanRequest />} />
        <Route path="my-loans" element={<MyLoans />} />
      </Route>

      {/* Catch all */}
      <Route path="/" element={<Navigate to="/borrower" replace />} />
    </Routes>
  )
}
