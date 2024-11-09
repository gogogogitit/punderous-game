'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Submission {
  id: number;
  email: string;
  comment: string | null;
  timestamp: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState('')
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isSettingPassword, setIsSettingPassword] = useState(false)
  const [isResettingPassword, setIsResettingPassword] = useState(false)
  const [resetEmailSent, setResetEmailSent] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    checkPasswordSet()
    const resetToken = searchParams.get('reset_token')
    if (resetToken) {
      setIsResettingPassword(true)
    }
  }, [searchParams])

  const checkPasswordSet = async () => {
    try {
      const response = await fetch('/api/admin-password')
      const data = await response.json()
      setIsSettingPassword(!data.hasPassword)
    } catch (error) {
      console.error('Error checking password status:', error)
      setError('Failed to check password status')
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions()
    }
  }, [isAuthenticated])

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/submit-email')
      if (!response.ok) {
        throw new Error('Failed to fetch submissions')
      }
      const data = await response.json()
      setSubmissions(data.submissions)
    } catch (error) {
      console.error('Error fetching submissions:', error)
      setError('Failed to load submissions')
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, action: 'login' }),
      })
      const data = await response.json()
      if (data.success) {
        setIsAuthenticated(true)
        setError('')
      } else {
        setError('Incorrect password')
      }
    } catch (error) {
      console.error('Error during authentication:', error)
      setError('Authentication failed')
    }
  }

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    try {
      const response = await fetch('/api/admin-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword, action: 'set' }),
      })
      const data = await response.json()
      if (data.success) {
        setIsSettingPassword(false)
        setIsResettingPassword(false)
        setError('')
        if (isResettingPassword) {
          setIsAuthenticated(true)
        }
      } else {
        setError('Failed to set password')
      }
    } catch (error) {
      console.error('Error setting password:', error)
      setError('Failed to set password')
    }
  }

  const handleGenerateResetToken = async () => {
    try {
      const response = await fetch('/api/admin-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate_reset_token' }),
      })
      const data = await response.json()
      if (data.success) {
        setResetEmailSent(true)
        setError('')
      } else {
        setError('Failed to send reset email')
      }
    } catch (error) {
      console.error('Error generating reset token:', error)
      setError('Failed to send reset email')
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    try {
      const resetToken = searchParams.get('reset_token')
      const response = await fetch('/api/admin-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword, token: resetToken, action: 'reset_password' }),
      })
      const data = await response.json()
      if (data.success) {
        setIsResettingPassword(false)
        setError('')
        setIsAuthenticated(true)
        router.push('/admin') // Remove the reset_token from the URL
      } else {
        setError('Failed to reset password')
      }
    } catch (error) {
      console.error('Error resetting password:', error)
      setError('Failed to reset password')
    }
  }

  if (isSettingPassword || isResettingPassword) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>{isResettingPassword ? 'Reset Admin Password' : 'Set Admin Password'}</CardTitle>
            <CardDescription>{isResettingPassword ? 'Enter a new password for the admin area' : 'Create a new password for the admin area'}</CardDescription>
          </CardHeader>
          <form onSubmit={isResettingPassword ? handleResetPassword : handleSetPassword}>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">{isResettingPassword ? 'Reset Password' : 'Set Password'}</Button>
            </CardFooter>
          </form>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        </Card>
      </div>
    )
  }

  if (isAuthenticated) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <p className="mb-6">Welcome to the admin area. Here you can manage your Punderful game.</p>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Email Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>{submission.email}</TableCell>
                    <TableCell>{submission.comment || 'N/A'}</TableCell>
                    <TableCell>{new Date(submission.timestamp).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Button onClick={() => router.push('/')} className="mt-4">
          Back to Home
        </Button>
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
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button type="submit" className="w-full">Login</Button>
            <Button variant="outline" onClick={handleGenerateResetToken} className="w-full">Forgot Password</Button>
          </CardFooter>
        </form>
        {resetEmailSent && (
          <p className="text-green-500 text-center mt-2">Reset email sent. Please check your inbox.</p>
        )}
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
      </Card>
    </div>
  )
}