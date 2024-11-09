'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"

interface Submission {
  id: number
  email: string
  comment: string | null
  created_at: string
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState('')
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [isResetting, setIsResetting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const storedAuth = localStorage.getItem('isAuthenticated')
      if (storedAuth === 'true') {
        setIsAuthenticated(true)
        await fetchSubmissions()
      }
      setIsLoading(false)
    }
    checkAuth()
  }, [])

  const fetchSubmissions = async () => {
    try {
      setError('')
      const res = await fetch('/api/submit-email')
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      
      const data = await res.json()
      
      console.log('Fetched data:', data)
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format')
      }
      
      setSubmissions(data)
    } catch (err) {
      console.error('Fetch error:', err)
      setError('Failed to load submissions: ' + (err instanceof Error ? err.message : 'Unknown error'))
      setSubmissions([])
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch('/api/admin-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, action: 'login' }),
      })
      const data = await res.json()
      if (data.success) {
        setIsAuthenticated(true)
        localStorage.setItem('isAuthenticated', 'true')
        await fetchSubmissions()
      } else {
        setError('Invalid password')
      }
    } catch (err) {
      setError('Login failed')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('isAuthenticated')
    router.push('/admin')
  }

  const handleForgotPassword = async () => {
    setIsResetting(true)
    setError('')
    setMessage('')
    try {
      const res = await fetch('/api/admin-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate_reset_token' }),
      })
      const data = await res.json()
      if (data.success) {
        setMessage('Password reset email sent to michaeljkatz.email@gmail.com. Please check your inbox.')
      } else {
        setError('Failed to send reset email: ' + (data.error || 'Unknown error'))
      }
    } catch (err) {
      setError('Failed to initiate password reset: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setIsResetting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Enter password to access admin area</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="current-password"
              />
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button type="submit" className="w-full">Login</Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={handleForgotPassword}
                disabled={isResetting}
              >
                {isResetting ? 'Sending...' : 'Forgot Password'}
              </Button>
            </CardFooter>
          </form>
          {error && (
            <p className="text-red-500 text-center mt-2 px-4 mb-4">{error}</p>
          )}
          {message && (
            <p className="text-green-500 text-center mt-2 px-4 mb-4">{message}</p>
          )}
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button onClick={handleLogout} variant="destructive">
          Logout
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : submissions.length === 0 ? (
            <p>No submissions found</p>
          ) : (
            <div className="space-y-4">
              {submissions.map((sub) => (
                <div key={sub.id} className="border p-4 rounded-lg">
                  <p><strong>Email:</strong> {sub.email}</p>
                  {sub.comment && (
                    <p><strong>Comment:</strong> {sub.comment}</p>
                  )}
                  <p><strong>Date:</strong> {new Date(sub.created_at).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Button 
        onClick={() => router.push('/')} 
        className="mt-4"
      >
        Back to Home
      </Button>
    </div>
  )
}