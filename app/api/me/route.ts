import { type NextRequest, NextResponse } from "next/server"
import { getTikTokAccessTokenFromCookies, getTikTokUserInfoServer, refreshTikTokAccessToken } from "@/lib/tiktok-server"

export async function GET(request: NextRequest) {
  try {
    // Get access token from HTTP-only cookies
    const accessToken = getTikTokAccessTokenFromCookies()

    if (!accessToken) {
      return NextResponse.json(
        { error: "No access token found. Please authenticate with TikTok first." },
        { status: 401 },
      )
    }

    // Try to fetch user info with current access token
    let userInfo = await getTikTokUserInfoServer(accessToken)

    // If the request fails (possibly due to expired token), try to refresh
    if (!userInfo) {
      console.log("Access token might be expired, attempting to refresh...")

      const refreshedTokenData = await refreshTikTokAccessToken()

      if (!refreshedTokenData) {
        return NextResponse.json(
          { error: "Failed to refresh access token. Please re-authenticate with TikTok." },
          { status: 401 },
        )
      }

      // Retry with refreshed token
      userInfo = await getTikTokUserInfoServer(refreshedTokenData.access_token)
    }

    if (!userInfo) {
      return NextResponse.json({ error: "Failed to fetch user information from TikTok." }, { status: 500 })
    }

    // Check if TikTok returned an error
    if (userInfo.error) {
      console.error("TikTok API error:", userInfo.error)
      return NextResponse.json(
        {
          error: "TikTok API error",
          details: userInfo.error.message,
          code: userInfo.error.code,
        },
        { status: 400 },
      )
    }

    // Return user information
    return NextResponse.json({
      success: true,
      user: userInfo.data.user,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Unexpected error in /api/me:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred while fetching user information." },
      { status: 500 },
    )
  }
}

// Handle OPTIONS for CORS if needed
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
