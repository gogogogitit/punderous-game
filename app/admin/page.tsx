'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface EmailSubmission {
  id: number;
  email: string;
  comment: string | null;
  timestamp: string;
}

function AdminContent() {
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [submissions, setSubmissions] = useState<EmailSubmission[]>([])
  const [isResettingPassword, setIsResettingPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetEmailSent, setResetEmailSent] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true)
      try {
        const storedAuth = localStorage.getItem('isAuthenticated')
        if (storedAuth === 'true') {
          setIsAuthenticated(true)
          await fetchSubmissions()
        }
      } catch (error) {
        console.error('Error during initial auth check:', error)
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [])

  useEffect(() => {
    if (!searchParams) return
    const resetToken = searchParams.get('reset_token')
    if (resetToken) {
      setIsResettingPassword(true)
    }
  }, [searchParams])

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/admin/submissions')
      if (!response.ok) throw new Error('Failed to fetch submissions')
      const data = await response.json()
      setSubmissions(data)
    } catch (error) {
      console.error('Error fetching submissions:', error)
      setError('Failed to load submissions')
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (response.ok) {
        setIsAuthenticated(true)
        localStorage.setItem('isAuthenticated', 'true')
        setError('')
        await fetchSubmissions()
      } else {
        setError('Incorrect password')
      }
    } catch (error) {
      console.error('Error during authentication:', error)
      setError('Authentication failed')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('isAuthenticated')
    setSubmissions([])
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      })
      if (response.ok) {
        setResetEmailSent(true)
        setError('')
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to send reset email')
      }
    } catch (error) {
      console.error('Error sending reset email:', error)
      setError('Failed to send reset email')
    }
  }

  const handleNewPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    try {
      const resetToken = searchParams?.get('reset_token')
      const response = await fetch('/api/admin/new-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword, token: resetToken }),
      })
      if (response.ok) {
        setIsResettingPassword(false)
        setIsAuthenticated(true)
        localStorage.setItem('isAuthenticated', 'true')
        setError('')
        await fetchSubmissions()
        router.push('/admin')
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to set new password')
      }
    } catch (error) {
      console.error('Error setting new password:', error)
      setError('Failed to set new password')
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (isResettingPassword) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>Enter your new password</CardDescription>
          </CardHeader>
          <form onSubmit={handleNewPassword}>
            <CardContent className="space-y-4">
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">Set New Password</Button>
            </CardFooter>
          </form>
          {error && (
            <Alert variant="destructive" className="mt-4 mx-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </Card>
      </div>
    )
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-gray-900">Email Submissions</h1>
            <Button onClick={handleLogout} variant="destructive">Logout</Button>
          </div>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {submissions.length === 0 ? (
            <p className="text-gray-500 text-center">No submissions yet.</p>
          ) : (
            <div className="space-y-4">
              {submissions.map((sub) => (
                <Card key={sub.id}>
                  <CardHeader>
                    <CardTitle>{sub.email}</CardTitle>
                    <CardDescription>{new Date(sub.timestamp).toLocaleString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{sub.comment || 'No comment'}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Enter the password to access the admin area</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button type="submit" className="w-full">Login</Button>
            <Button variant="outline" onClick={() => setIsResettingPassword(true)} className="w-full">
              Forgot Password
            </Button>
          </CardFooter>
        </form>
        {error && (
          <Alert variant="destructive" className="mt-4 mx-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </Card>
      {isResettingPassword && !resetEmailSent && (
        <Card className="w-[350px] mt-4">
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>Enter your email to receive a password reset link</CardDescription>
          </CardHeader>
          <form onSubmit={handleResetPassword}>
            <CardContent>
              <Input
                id="resetEmail"
                name="resetEmail"
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button type="submit" className="w-full">Send Reset Link</Button>
              <Button variant="outline" onClick={() => setIsResettingPassword(false)} className="w-full">
                Back to Login
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
      {resetEmailSent && (
        <Alert className="mt-4 w-[350px]">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>Password reset email sent. Please check your inbox.</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

function AdminPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <AdminContent />
    </Suspense>
  )
}

export default AdminPage