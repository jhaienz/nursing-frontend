import { useMutation } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"
import type { AuthResponse } from "@/lib/types"
import { useAuthStore } from "@/lib/auth"

export const useAdminLogin = () => {
  const { login } = useAuthStore()

  return useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await apiClient.post<AuthResponse>(
        "/auth/admin/login",
        credentials
      )
      return response.data
    },
    onSuccess: (data, variables) => {
      login(data.access_token, {
        username: variables.username,
        isAdmin: true,
      })
    },
  })
}

export const useCreateAdmin = () => {
  return useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await apiClient.post("/admins", credentials)
      return response.data
    },
  })
}
