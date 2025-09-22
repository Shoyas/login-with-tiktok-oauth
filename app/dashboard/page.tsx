"use client"

import { useTikTokAuth } from "@/hooks/use-tiktok-auth"
import { formatTikTokStats, getTikTokProfileUrl } from "@/lib/tiktok-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Users,
  UserPlus,
  Heart,
  Video,
  ExternalLink,
  RefreshCw,
  LogOut,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated, error, refetch, logout } = useTikTokAuth()

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your TikTok profile...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>{error || "Please sign in with TikTok to access your dashboard"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <Button onClick={refetch} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button asChild>
                <Link href="/auth/login">Sign In with TikTok</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const stats = formatTikTokStats(user)
  const profileUrl = getTikTokProfileUrl(user)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">TikTok Dashboard</h1>
              <Badge variant="secondary" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Connected
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={refetch} variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button onClick={logout} variant="destructive" size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Profile Card */}
          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader className="text-center">
              <Avatar className="mx-auto h-20 w-20">
                <AvatarImage src={user.avatar_large_url || user.avatar_url} alt={user.display_name} />
                <AvatarFallback className="text-lg">{user.display_name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <CardTitle className="flex items-center justify-center gap-2">
                  {user.display_name}
                  {user.is_verified && <CheckCircle className="h-4 w-4 text-blue-500" />}
                </CardTitle>
                <CardDescription className="text-center">{user.bio_description || "No bio available"}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-transparent" variant="outline">
                <a href={profileUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View TikTok Profile
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Followers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.followers}</div>
              <p className="text-xs text-muted-foreground">{user.follower_count.toLocaleString()} total followers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Following</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.following}</div>
              <p className="text-xs text-muted-foreground">{user.following_count.toLocaleString()} accounts followed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.likes}</div>
              <p className="text-xs text-muted-foreground">{user.likes_count.toLocaleString()} likes received</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Videos</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.videos}</div>
              <p className="text-xs text-muted-foreground">{user.video_count.toLocaleString()} videos posted</p>
            </CardContent>
          </Card>

          {/* Account Details */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
              <CardDescription>Information from your TikTok account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Open ID</label>
                  <p className="text-sm font-mono bg-muted p-2 rounded mt-1">{user.open_id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Union ID</label>
                  <p className="text-sm font-mono bg-muted p-2 rounded mt-1">{user.union_id}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Verified Account</span>
                <Badge variant={user.is_verified ? "default" : "secondary"}>
                  {user.is_verified ? "Verified" : "Not Verified"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
