// TikTok OAuth configuration constants
export const TIKTOK_CONFIG = {
  CLIENT_ID: process.env.TIKTOK_CLIENT_ID!,
  CLIENT_SECRET: process.env.TIKTOK_CLIENT_SECRET!,
  REDIRECT_URI: process.env.TIKTOK_REDIRECT_URI!,
  SCOPES: ["user.info.basic", "user.info.profile", "user.info.stats"],
  BASE_URL: "https://www.tiktok.com/v2/auth/authorize",
  TOKEN_URL: "https://open.tiktokapis.com/v2/oauth/token/",
  USER_INFO_URL: "https://open.tiktokapis.com/v2/user/info/",
} as const

// Generate TikTok OAuth URL
export function generateTikTokAuthUrl(state?: string): string {
  const params = new URLSearchParams({
    client_key: TIKTOK_CONFIG.CLIENT_ID,
    scope: TIKTOK_CONFIG.SCOPES.join(","),
    response_type: "code",
    redirect_uri: TIKTOK_CONFIG.REDIRECT_URI,
    state: state || Math.random().toString(36).substring(7),
  })

  return `${TIKTOK_CONFIG.BASE_URL}?${params.toString()}`
}

// TikTok API response types
export interface TikTokTokenResponse {
  access_token: string
  expires_in: number
  refresh_token: string
  refresh_expires_in: number
  scope: string
  token_type: string
}

export interface TikTokUserInfo {
  open_id: string
  union_id: string
  avatar_url: string
  avatar_url_100: string
  avatar_large_url: string
  display_name: string
  bio_description: string
  profile_deep_link: string
  is_verified: boolean
  follower_count: number
  following_count: number
  likes_count: number
  video_count: number
}

export interface TikTokUserResponse {
  data: {
    user: TikTokUserInfo
  }
  error: {
    code: string
    message: string
    log_id: string
  }
}
