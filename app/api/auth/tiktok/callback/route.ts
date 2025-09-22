import { type NextRequest, NextResponse } from "next/server"
import { getTikTokAccessTokenServer, setTikTokTokenCookies } from "@/lib/tiktok-server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const state = searchParams.get("state")
    const error = searchParams.get("error")
    const errorDescription = searchParams.get("error_description")

    // Handle OAuth errors
    if (error) {
      console.error("TikTok OAuth error:", error, errorDescription)
      return NextResponse.redirect(
        new URL(
          `/auth/error?error=${encodeURIComponent(error)}&description=${encodeURIComponent(errorDescription || "")}`,
          request.url,
        ),
      )
    }

    // Validate required parameters
    if (!code) {
      console.error("No authorization code received from TikTok")
      return NextResponse.redirect(
        new URL("/auth/error?error=missing_code&description=No authorization code received", request.url),
      )
    }

    // Exchange authorization code for access token
    const tokenData = await getTikTokAccessTokenServer(code)

    if (!tokenData) {
      console.error("Failed to exchange code for access token")
      return NextResponse.redirect(
        new URL(
          "/auth/error?error=token_exchange_failed&description=Failed to get access token from TikTok",
          request.url,
        ),
      )
    }

    // Set HTTP-only cookies with the tokens
    setTikTokTokenCookies(tokenData)

    // Redirect to dashboard or success page
    const redirectUrl = new URL("/dashboard", request.url)

    // Optional: Add success query parameter
    redirectUrl.searchParams.set("auth", "success")

    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    console.error("Unexpected error in TikTok OAuth callback:", error)
    return NextResponse.redirect(
      new URL(
        "/auth/error?error=unexpected_error&description=An unexpected error occurred during authentication",
        request.url,
      ),
    )
  }
}

// Handle POST requests (some OAuth flows might use POST)
export async function POST(request: NextRequest) {
  return GET(request)
}
