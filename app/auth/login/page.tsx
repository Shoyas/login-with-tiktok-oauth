"use client"

import { generateTikTokAuthUrl } from "@/lib/tiktok-config"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Music, Users, Video, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const handleTikTokLogin = () => {
    const authUrl = generateTikTokAuthUrl()
    window.location.href = authUrl
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
            <Music className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Connect with TikTok</h1>
          <p className="text-muted-foreground">Access your TikTok profile and analytics</p>
        </div>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">What you'll get access to:</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm">View your follower and following counts</span>
            </div>
            <div className="flex items-center gap-3">
              <Video className="h-4 w-4 text-primary" />
              <span className="text-sm">See your total video count</span>
            </div>
            <div className="flex items-center gap-3">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm">Track your total likes received</span>
            </div>
          </CardContent>
        </Card>

        {/* Login Button */}
        <Card>
          <CardContent className="pt-6">
            <Button onClick={handleTikTokLogin} className="w-full" size="lg">
              <Music className="mr-2 h-4 w-4" />
              Sign in with TikTok
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-3">
              We'll redirect you to TikTok to authorize access to your account
            </p>
          </CardContent>
        </Card>

        {/* Permissions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Permissions Requested</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs">Basic profile information</span>
              <Badge variant="secondary" className="text-xs">
                Required
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs">Profile statistics</span>
              <Badge variant="secondary" className="text-xs">
                Required
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <Button variant="link" asChild>
            <Link href="/">← Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
