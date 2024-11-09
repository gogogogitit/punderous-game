'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"

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
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const storedAuth = localStorage.getItem('isAuthenticated')
      if (storedAuth === 'true') {
        setIsAuthenticated(true)
        fetchSubmissions()
      }
    }
    checkAuth()
  }, [])

  const fetchSubmissions = async () => {
    try {
      const res = await fetch('/api/submit-email')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      console.log('Fetched data:', data)
      setSubmissions(data)
    } catch (err) {
      console.error('Fetch error:', err)
      setError('Failed to load submissions')
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
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
        fetchSubmissions()
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
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">Login</Button>
            </CardFooter>
          </form>
          {error && (
            <p className="text-red-500 text-center mt-2 px-4 mb-4">{error}</p>
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
            <p>Loading submissions...</p>
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