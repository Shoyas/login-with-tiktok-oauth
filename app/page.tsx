import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, Shield, Zap, Users } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-8">
            <Music className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">TikTok OAuth Integration</h1>
          <p className="text-xl text-muted-foreground">
            Connect your TikTok account and access your profile data securely with our OAuth implementation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/auth/login">
                <Music className="mr-2 h-4 w-4" />
                Connect TikTok Account
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/dashboard">View Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our TikTok OAuth integration provides secure access to your account data with industry-standard security
            practices
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Secure Authentication</CardTitle>
              <CardDescription>HTTP-only cookies and server-side token management for maximum security</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Profile Access</CardTitle>
              <CardDescription>
                View your TikTok profile information, follower counts, and account statistics
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Real-time Data</CardTitle>
              <CardDescription>
                Get up-to-date information from your TikTok account with automatic token refresh
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>TikTok OAuth Integration Demo - Built with Next.js 15 & App Router</p>
        </div>
      </footer>
    </div>
  )
}
