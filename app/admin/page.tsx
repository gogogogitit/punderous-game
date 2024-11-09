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
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isSettingPassword, setIsSettingPassword] = useState(false)
  const [isResettingPassword, setIsResettingPassword] = useState(false)
  const [resetEmailSent, setResetEmailSent] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string>('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true)
      setDebugInfo('Checking authentication status...')
      try {
        const storedAuth = localStorage.getItem('isAuthenticated')
        if (storedAuth === 'true') {
          setIsAuthenticated(true)
          setDebugInfo(prev => prev + '\nAuthenticated from local storage')
          await fetchSubmissions()
        } else {
          await checkPasswordSet()
        }
      } catch (error) {
        console.error('Error during initial auth check:', error)
        setDebugInfo(prev => prev + `\nError during initial auth check: ${error}`)
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [])

  useEffect(() => {
    const resetToken = searchParams.get('reset_token')
    if (resetToken) {
      setIsResettingPassword(true)
      setDebugInfo(prev => prev + '\nReset token found in URL')
    }
  }, [searchParams])

  const checkPasswordSet = async () => {
    try {
      setDebugInfo(prev => prev + '\nChecking if password is set...')
      const response = await fetch('/api/admin-password')
      const data = await response.json()
      setIsSettingPassword(!data.hasPassword)
      setDebugInfo(prev => prev + `\nPassword set: ${data.hasPassword}`)
    } catch (error) {
      console.error('Error checking password status:', error)
      setError('Failed to check password status')
      setDebugInfo(prev => prev + `\nError checking password: ${error}`)
    }
  }

  const fetchSubmissions = async () => {
    try {
      setDebugInfo(prev => prev + '\nFetching submissions...')
      const response = await fetch('/api/submit-email')
      if (!response.ok) {
        throw new Error('Failed to fetch submissions')
      }
      const data = await response.json()
      setSubmissions(data.submissions)
      setDebugInfo(prev => prev + `\nFetched ${data.submissions.length} submissions`)
    } catch (error) {
      console.error('Error fetching submissions:', error)
      setError('Failed to load submissions')
      setDebugInfo(prev => prev + `\nError fetching submissions: ${error}`)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setDebugInfo(prev => prev + '\nAttempting login...')
    try {
      const response = await fetch('/api/admin-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, action: 'login' }),
      })
      const data = await response.json()
      if (data.success) {
        setIsAuthenticated(true)
        localStorage.setItem('isAuthenticated', 'true')
        setError('')
        await fetchSubmissions()
        setDebugInfo(prev => prev + '\nLogin successful')
      } else {
        setError('Incorrect password')
        setDebugInfo(prev => prev + '\nLogin failed: ' + data.error)
      }
    } catch (error) {
      console.error('Error during authentication:', error)
      setError('Authentication failed')
      setDebugInfo(prev => prev + `\nAuthentication error: ${error}`)
    }
  }

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setDebugInfo(prev => prev + '\nAttempting to set password...')
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
        setIsAuthenticated(true)
        localStorage.setItem('isAuthenticated', 'true')
        setError('')
        await fetchSubmissions()
        setDebugInfo(prev => prev + '\nPassword set successfully')
      } else {
        setError('Failed to set password')
        setDebugInfo(prev => prev + '\nFailed to set password: ' + data.error)
      }
    } catch (error) {
      console.error('Error setting password:', error)
      setError('Failed to set password')
      setDebugInfo(prev => prev + `\nError setting password: ${error}`)
    }
  }

  const handleGenerateResetToken = async () => {
    setDebugInfo(prev => prev + '\nGenerating reset token...')
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
        setDebugInfo(prev => prev + '\nReset email sent')
      } else {
        setError('Failed to send reset email')
        setDebugInfo(prev => prev + '\nFailed to send reset email: ' + data.error)
      }
    } catch (error) {
      console.error('Error generating reset token:', error)
      setError('Failed to send reset email')
      setDebugInfo(prev => prev + `\nError generating reset token: ${error}`)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setDebugInfo(prev => prev + '\nAttempting to reset password...')
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
        setIsAuthenticated(true)
        localStorage.setItem('isAuthenticated', 'true')
        setError('')
        await fetchSubmissions()
        router.push('/admin') // Remove the reset_token from the URL
        setDebugInfo(prev => prev + '\nPassword reset successfully')
      } else {
        setError('Failed to reset password')
        setDebugInfo(prev => prev + '\nFailed to reset password: ' + data.error)
      }
    } catch (error) {
      console.error('Error resetting password:', error)
      setError('Failed to reset password')
      setDebugInfo(prev => prev + `\nError resetting password: ${error}`)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('isAuthenticated')
    setDebugInfo(prev => prev + '\nLogged out')
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isSettingPassword) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Set Admin Password</CardTitle>
            <CardDescription>Create a new password for the admin area</CardDescription>
          </CardHeader>
          <form onSubmit={handleSetPassword}>
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
              <Button type="submit" className="w-full">Set Password</Button>
            </CardFooter>
          </form>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        </Card>
      </div>
    )
  }

  if (isResettingPassword) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Reset Admin Password</CardTitle>
            <CardDescription>Enter a new password for the admin area</CardDescription>
          </CardHeader>
          <form onSubmit={handleResetPassword}>
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
              <Button type="submit" className="w-full">Reset Password</Button>
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
        
        <div className="flex justify-between">
          <Button onClick={() => router.push('/')} className="mt-4">
            Back to Home
          </Button>
          <Button onClick={handleLogout} variant="destructive" className="mt-4">
            Logout
          </Button>
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
      <div className="fixed bottom-4 left-4 bg-gray-800 text-white p-4 rounded">
        <h3 className="font-bold mb-2">Debug Info:</h3>
        <pre className="whitespace-pre-wrap">{debugInfo}</pre>
      </div>
    </div>
  )
}