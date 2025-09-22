"use client"

import type { TikTokUserInfo } from "./tiktok-config"

// Client-side response types
export interface TikTokUserResponse {
  success: boolean
  user?: TikTokUserInfo
  error?: string
  details?: string
  code?: string
  timestamp?: string
}

export interface LogoutResponse {
  success: boolean
  message?: string
  error?: string
}

// Client-side utility to fetch TikTok user data from our API
export async function fetchTikTokDataClient(): Promise<TikTokUserResponse> {
  try {
    const response = await fetch("/api/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies in the request
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Failed to fetch user data",
        details: data.details,
        code: data.code,
      }
    }

    return data
  } catch (error) {
    console.error("Error fetching TikTok data:", error)
    return {
      success: false,
      error: "Network error occurred while fetching user data",
    }
  }
}

// Client-side utility to logout user
export async function logoutTikTokClient(): Promise<LogoutResponse> {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies in the request
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Failed to logout",
      }
    }

    return data
  } catch (error) {
    console.error("Error during logout:", error)
    return {
      success: false,
      error: "Network error occurred during logout",
    }
  }
}

// Client-side utility to check if user is authenticated
export async function checkTikTokAuthStatus(): Promise<boolean> {
  try {
    const response = await fetch("/api/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })

    return response.ok
  } catch (error) {
    console.error("Error checking auth status:", error)
    return false
  }
}

// Client-side utility to format TikTok user stats
export function formatTikTokStats(user: TikTokUserInfo) {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  return {
    followers: formatNumber(user.follower_count),
    following: formatNumber(user.following_count),
    likes: formatNumber(user.likes_count),
    videos: formatNumber(user.video_count),
  }
}

// Client-side utility to get TikTok profile URL
export function getTikTokProfileUrl(user: TikTokUserInfo): string {
  return user.profile_deep_link || `https://www.tiktok.com/@${user.display_name}`
}
