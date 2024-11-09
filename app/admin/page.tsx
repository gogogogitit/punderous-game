'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AdminPage() {
  const [testEmail, setTestEmail] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleTestEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)
    setResult(null)

    try {
      const response = await fetch('/api/submit-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail, comment: 'This is a test submission from the admin page.' }),
      })

      if (response.ok) {
        setResult({ success: true, message: 'Test email sent successfully. Check your inbox.' })
      } else {
        setResult({ success: false, message: 'Failed to send test email. Check your server logs.' })
      }
    } catch (error) {
      setResult({ success: false, message: 'An error occurred while sending the test email.' })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Admin - Email Test</CardTitle>
          <CardDescription>Send a test email to confirm the system is working</CardDescription>
        </CardHeader>
        <form onSubmit={handleTestEmail}>
          <CardContent>
            <Input
              id="testEmail"
              type="email"
              placeholder="Enter your email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              required
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSending}>
              {isSending ? 'Sending...' : 'Send Test Email'}
            </Button>
          </CardFooter>
        </form>
        {result && (
          <Alert variant={result.success ? 'default' : 'destructive'} className="mt-4 mx-4">
            <AlertTitle>{result.success ? 'Success' : 'Error'}</AlertTitle>
            <AlertDescription>{result.message}</AlertDescription>
          </Alert>
        )}
      </Card>
    </div>
  )
}