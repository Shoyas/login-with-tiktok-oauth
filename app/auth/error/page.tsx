"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const description = searchParams.get("description")

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case "access_denied":
        return "You denied access to your TikTok account. Please try again if you want to continue."
      case "missing_code":
        return "Authorization code was not received from TikTok. Please try the login process again."
      case "token_exchange_failed":
        return "Failed to exchange authorization code for access token. Please try again."
      case "unexpected_error":
        return "An unexpected error occurred during authentication. Please try again later."
      default:
        return "An authentication error occurred. Please try again."
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-xl">Authentication Error</CardTitle>
          <CardDescription>There was a problem signing you in with TikTok</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm text-muted-foreground">{getErrorMessage(error)}</p>
            {description && <p className="mt-2 text-xs text-muted-foreground">Details: {description}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Button asChild>
              <Link href="/auth/login">Try Again</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
