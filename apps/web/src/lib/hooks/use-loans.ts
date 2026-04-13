import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"
import type { Loan } from "@/lib/types"
import { LoanStatus } from "@/lib/types"

const LOANS_KEY = ["loans"]

export const useLoans = (status?: LoanStatus) => {
  return useQuery({
    queryKey: [...LOANS_KEY, status],
    queryFn: async () => {
      const response = await apiClient.get<Loan[]>("/loans", {
        params: status ? { status } : undefined,
      })
      return response.data
    },
  })
}

export const useLoan = (id: number) => {
  return useQuery({
    queryKey: [...LOANS_KEY, id],
    queryFn: async () => {
      const response = await apiClient.get<Loan>(`/loans/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

export const useLoansByBorrower = (username: string) => {
  return useQuery({
    queryKey: [...LOANS_KEY, "borrower", username],
    queryFn: async () => {
      const response = await apiClient.get<Loan[]>(
        `/loans/borrower/${username}`
      )
      return response.data
    },
    enabled: !!username,
  })
}

export const useCreateLoan = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      username: string
      pin: string
      itemId: number
      quantity: number
      dueDate?: string
    }) => {
      const response = await apiClient.post("/loans", data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOANS_KEY })
    },
  })
}

export const useApproveLoan = (id: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.patch(`/loans/${id}/approve`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOANS_KEY })
      queryClient.invalidateQueries({ queryKey: [...LOANS_KEY, id] })
    },
  })
}

export const useRejectLoan = (id: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.patch(`/loans/${id}/reject`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOANS_KEY })
      queryClient.invalidateQueries({ queryKey: [...LOANS_KEY, id] })
    },
  })
}

export const useReturnLoan = (id: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.patch(`/loans/${id}/return`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOANS_KEY })
      queryClient.invalidateQueries({ queryKey: [...LOANS_KEY, id] })
    },
  })
}
