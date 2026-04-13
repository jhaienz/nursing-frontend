import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"
import type { Penalty } from "@/lib/types"
import { PenaltyStatus } from "@/lib/types"

const PENALTIES_KEY = ["penalties"]

export const usePenalties = (status?: PenaltyStatus) => {
  return useQuery({
    queryKey: [...PENALTIES_KEY, status],
    queryFn: async () => {
      const response = await apiClient.get<Penalty[]>("/penalties", {
        params: status ? { status } : undefined,
      })
      return response.data
    },
  })
}

export const usePenalty = (id: number) => {
  return useQuery({
    queryKey: [...PENALTIES_KEY, id],
    queryFn: async () => {
      const response = await apiClient.get<Penalty>(`/penalties/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

export const useClearPenalty = (id: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.patch(`/penalties/${id}/clear`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PENALTIES_KEY })
      queryClient.invalidateQueries({ queryKey: [...PENALTIES_KEY, id] })
    },
  })
}
