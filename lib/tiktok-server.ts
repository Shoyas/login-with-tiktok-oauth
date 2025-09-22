import { cookies } from "next/headers"
import { TIKTOK_CONFIG, type TikTokTokenResponse, type TikTokUserResponse } from "./tiktok-config"

// Server-side utility to fetch access token from TikTok
export async function getTikTokAccessTokenServer(code: string): Promise<TikTokTokenResponse | null> {
  try {
    const response = await fetch(TIKTOK_CONFIG.TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cache-Control": "no-cache",
      },
      body: new URLSearchParams({
        client_key: TIKTOK_CONFIG.CLIENT_ID,
        client_secret: TIKTOK_CONFIG.CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: TIKTOK_CONFIG.REDIRECT_URI,
      }),
    })

    if (!response.ok) {
      console.error("TikTok token exchange failed:", response.status, response.statusText)
      return null
    }

    const data = await response.json()

    if (data.error) {
      console.error("TikTok token error:", data.error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error fetching TikTok access token:", error)
    return null
  }
}

// Server-side utility to fetch TikTok user info
export async function getTikTokUserInfoServer(accessToken: string): Promise<TikTokUserResponse | null> {
  try {
    const response = await fetch(
      `${TIKTOK_CONFIG.USER_INFO_URL}?fields=open_id,union_id,avatar_url,avatar_url_100,avatar_large_url,display_name,bio_description,profile_deep_link,is_verified,follower_count,following_count,likes_count,video_count`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    )

    if (!response.ok) {
      console.error("TikTok user info fetch failed:", response.status, response.statusText)
      return null
    }

    const data = await response.json()

    if (data.error) {
      console.error("TikTok user info error:", data.error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error fetching TikTok user info:", error)
    return null
  }
}

// Server-side utility to set HTTP-only cookies
export function setTikTokTokenCookies(tokenData: TikTokTokenResponse) {
  const cookieStore = cookies()

  // Set access token cookie (expires in 24 hours by default)
  cookieStore.set("tiktok_access_token", tokenData.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: tokenData.expires_in || 86400, // 24 hours default
    path: "/",
  })

  // Set refresh token cookie (expires in 365 days by default)
  cookieStore.set("tiktok_refresh_token", tokenData.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: tokenData.refresh_expires_in || 31536000, // 365 days default
    path: "/",
  })
}

// Server-side utility to get access token from cookies
export function getTikTokAccessTokenFromCookies(): string | null {
  const cookieStore = cookies()
  const accessToken = cookieStore.get("tiktok_access_token")
  return accessToken?.value || null
}

// Server-side utility to get refresh token from cookies
export function getTikTokRefreshTokenFromCookies(): string | null {
  const cookieStore = cookies()
  const refreshToken = cookieStore.get("tiktok_refresh_token")
  return refreshToken?.value || null
}

// Server-side utility to refresh access token
export async function refreshTikTokAccessToken(): Promise<TikTokTokenResponse | null> {
  const refreshToken = getTikTokRefreshTokenFromCookies()

  if (!refreshToken) {
    return null
  }

  try {
    const response = await fetch(TIKTOK_CONFIG.TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cache-Control": "no-cache",
      },
      body: new URLSearchParams({
        client_key: TIKTOK_CONFIG.CLIENT_ID,
        client_secret: TIKTOK_CONFIG.CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    })

    if (!response.ok) {
      console.error("TikTok token refresh failed:", response.status, response.statusText)
      return null
    }

    const data = await response.json()

    if (data.error) {
      console.error("TikTok token refresh error:", data.error)
      return null
    }

    // Update cookies with new tokens
    setTikTokTokenCookies(data)

    return data
  } catch (error) {
    console.error("Error refreshing TikTok access token:", error)
    return null
  }
}

// Server-side utility to clear TikTok cookies (logout)
export function clearTikTokTokenCookies() {
  const cookieStore = cookies()

  cookieStore.set("tiktok_access_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  })

  cookieStore.set("tiktok_refresh_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  })
}
