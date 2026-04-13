import { create } from "zustand"

export type User = {
  username: string
  isAdmin: boolean
}

type AuthStore = {
  token: string | null
  user: User | null
  isLoading: boolean
  login: (token: string, user: User) => void
  logout: () => void
  restoreSession: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  token: null,
  user: null,
  isLoading: true,

  login: (token, user) => {
    localStorage.setItem("auth_token", token)
    localStorage.setItem("auth_user", JSON.stringify(user))
    set({ token, user, isLoading: false })
  },

  logout: () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_user")
    set({ token: null, user: null })
  },

  restoreSession: () => {
    const token = localStorage.getItem("auth_token")
    const userStr = localStorage.getItem("auth_user")

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        set({ token, user, isLoading: false })
      } catch {
        set({ isLoading: false })
      }
    } else {
      set({ isLoading: false })
    }
  },

  isAuthenticated: () => {
    const state = get()
    return !!state.token && !!state.user
  },
}))
