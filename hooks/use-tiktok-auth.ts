"use client"

import { useState, useEffect, useCallback } from "react"
import type { TikTokUserInfo } from "@/lib/tiktok-config"
import { fetchTikTokDataClient, logoutTikTokClient, type TikTokUserResponse } from "@/lib/tiktok-client"

interface UseTikTokAuthReturn {
  user: TikTokUserInfo | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
  refetch: () => Promise<void>
  logout: () => Promise<void>
}

export function useTikTokAuth(): UseTikTokAuthReturn {
  const [user, setUser] = useState<TikTokUserInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUserData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response: TikTokUserResponse = await fetchTikTokDataClient()

      if (response.success && response.user) {
        setUser(response.user)
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
        setError(response.error || "Failed to fetch user data")
      }
    } catch (err) {
      console.error("Error in fetchUserData:", err)
      setUser(null)
      setIsAuthenticated(false)
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await logoutTikTokClient()

      if (response.success) {
        setUser(null)
        setIsAuthenticated(false)
        setError(null)
        // Optionally redirect to home page
        window.location.href = "/"
      } else {
        setError(response.error || "Failed to logout")
      }
    } catch (err) {
      console.error("Error during logout:", err)
      setError("An error occurred during logout")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Check authentication status on mount
  useEffect(() => {
    fetchUserData()
  }, [fetchUserData])

  return {
    user,
    isLoading,
    isAuthenticated,
    error,
    refetch: fetchUserData,
    logout,
  }
}
