import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"
import type { Item } from "@/lib/types"

const ITEMS_KEY = ["items"]

export const useItems = (params?: {
  category?: string
  search?: string
  isReturnable?: boolean
}) => {
  return useQuery({
    queryKey: [...ITEMS_KEY, params],
    queryFn: async () => {
      const response = await apiClient.get<Item[]>("/items", { params })
      return response.data
    },
  })
}

export const useItem = (id: number) => {
  return useQuery({
    queryKey: [...ITEMS_KEY, id],
    queryFn: async () => {
      const response = await apiClient.get<Item>(`/items/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

export const useCreateItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      name: string
      category: string
      isReturnable: boolean
      quantity: number
    }) => {
      const response = await apiClient.post("/items", data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ITEMS_KEY })
    },
  })
}

export const useUpdateItem = (id: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      name?: string
      category?: string
      quantity?: number
    }) => {
      const response = await apiClient.patch(`/items/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ITEMS_KEY })
      queryClient.invalidateQueries({ queryKey: [...ITEMS_KEY, id] })
    },
  })
}

export const useDeleteItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/items/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ITEMS_KEY })
    },
  })
}
