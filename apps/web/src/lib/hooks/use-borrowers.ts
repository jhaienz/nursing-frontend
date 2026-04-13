import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"
import type { Borrower } from "@/lib/types"

const BORROWERS_KEY = ["borrowers"]

export const useBorrowers = () => {
  return useQuery({
    queryKey: BORROWERS_KEY,
    queryFn: async () => {
      const response = await apiClient.get<Borrower[]>("/borrowers")
      return response.data
    },
  })
}

export const useBorrower = (id: number) => {
  return useQuery({
    queryKey: [...BORROWERS_KEY, id],
    queryFn: async () => {
      const response = await apiClient.get<Borrower>(`/borrowers/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

export const useCreateBorrower = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      username: string
      fullName: string
      pin: string
    }) => {
      const response = await apiClient.post("/borrowers", data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BORROWERS_KEY })
    },
  })
}

export const useUpdateBorrower = (id: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { fullName?: string; isBlocked?: boolean }) => {
      const response = await apiClient.patch(`/borrowers/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BORROWERS_KEY })
      queryClient.invalidateQueries({ queryKey: [...BORROWERS_KEY, id] })
    },
  })
}

export const useDeleteBorrower = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/borrowers/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BORROWERS_KEY })
    },
  })
}
