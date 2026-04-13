import { queryClient } from "./lib/query-client"
import { QueryClientProvider } from "@tanstack/react-query"
import { StrictMode, useEffect } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter as Router } from "react-router-dom"
import "@workspace/ui/globals.css"
import { AppRoutes } from "./routes"
import { ThemeProvider } from "@/components/theme-provider"
import { useAuthStore } from "@/lib/auth"

function AppWithAuth() {
  const restoreSession = useAuthStore((state) => state.restoreSession)

  useEffect(() => {
    restoreSession()
  }, [restoreSession])

  return <AppRoutes />
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router>
        <ThemeProvider>
          <AppWithAuth />
        </ThemeProvider>
      </Router>
    </QueryClientProvider>
  </StrictMode>
)
