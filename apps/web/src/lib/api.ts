import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
})

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Only redirect to admin login on 401 if the request actually carried a JWT
// (i.e. it was an admin call whose token expired/invalid).
// Public borrower endpoints like POST /loans return 401 for wrong PIN — those
// should surface as form errors, not a redirect.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestHadToken = !!error.config?.headers?.Authorization
    if (error.response?.status === 401 && requestHadToken) {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("auth_user")
      window.location.href = "/admin/login"
    }
    return Promise.reject(error)
  }
)

export type ApiResponse<T> = {
  data?: T
  message?: string
  [key: string]: unknown
}
