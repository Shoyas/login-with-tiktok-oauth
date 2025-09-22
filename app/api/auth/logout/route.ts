import { type NextRequest, NextResponse } from "next/server"
import { clearTikTokTokenCookies } from "@/lib/tiktok-server"

export async function POST(request: NextRequest) {
  try {
    // Clear TikTok authentication cookies
    clearTikTokTokenCookies()

    return NextResponse.json({
      success: true,
      message: "Successfully logged out from TikTok",
    })
  } catch (error) {
    console.error("Error during logout:", error)
    return NextResponse.json({ error: "An error occurred during logout" }, { status: 500 })
  }
}

// Handle GET requests for logout (optional)
export async function GET(request: NextRequest) {
  try {
    clearTikTokTokenCookies()

    // Redirect to home page after logout
    return NextResponse.redirect(new URL("/", request.url))
  } catch (error) {
    console.error("Error during logout:", error)
    return NextResponse.redirect(new URL("/", request.url))
  }
}
