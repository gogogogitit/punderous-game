'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from 'next/image'

interface Submission {
  id: number;
  email: string;
  comment: string | null;
  timestamp: string;
}

function SubmissionsTable({ submissions }: { submissions: Submission[] }) {
  if (!Array.isArray(submissions)) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={3} className="text-center">Error loading submissions</TableCell>
        </TableRow>
      </TableBody>
    )
  }

  if (submissions.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={3} className="text-center">No submissions available</TableCell>
        </TableRow>
      </TableBody>
    )
  }

  return (
    <TableBody>
      {submissions.map((submission) => (
        <TableRow key={submission.id}>
          <TableCell>{submission.email}</TableCell>
          <TableCell>{submission.comment || 'N/A'}</TableCell>
          <TableCell>{new Date(submission.timestamp).toLocaleString()}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  )
}

function AdminContent() {
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
  const [submissionsError, setSubmissionsError] = useState<string | null>(null)
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false)
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
    if (!searchParams) return
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
      if (!response.ok) throw new Error('Failed to check password status')
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
    setIsLoadingSubmissions(true)
    setSubmissionsError(null)
    try {
      setDebugInfo(prev => prev + '\nFetching submissions...')
      const response = await fetch('/api/submit-email')
      
      // Log the raw response for debugging
      console.log('Raw response:', response);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json()
      console.log('Response data:', data);
      
      if (!data?.submissions || !Array.isArray(data.submissions)) {
        throw new Error('Invalid response format - expected submissions array')
      }
      
      setSubmissions(data.submissions)
      setDebugInfo(prev => prev + `\nFetched ${data.submissions.length} submissions`)
    } catch (error) {
      console.error('Error fetching submissions:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setSubmissionsError(`Failed to load submissions: ${errorMessage}`)
      setDebugInfo(prev => prev + `\nError fetching submissions: ${errorMessage}`)
      setSubmissions([])
    } finally {
      setIsLoadingSubmissions(false)
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
      if (!response.ok) throw new Error('Login request failed')
      const data = await response.json()
      if (data.success) {
        setIsAuthenticated(true)
        localStorage.setItem('isAuthenticated', 'true')
        setError('')
        await fetchSubmissions()
        setDebugInfo(prev => prev + '\nLogin successful')
      } else {
        setError(data.error || 'Incorrect password')
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
      if (!response.ok) throw new Error('Failed to set password')
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
        setError(data.error || 'Failed to set password')
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
      if (!response.ok) throw new Error('Failed to generate reset token')
      const data = await response.json()
      if (data.success) {
        setResetEmailSent(true)
        setError('')
        setDebugInfo(prev => prev + '\nReset email sent')
      } else {
        setError(data.error || 'Failed to send reset email')
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
      const resetToken = searchParams?.get('reset_token')
      const response = await fetch('/api/admin-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword, token: resetToken, action: 'reset_password' }),
      })
      if (!response.ok) throw new Error('Failed to reset password')
      const data = await response.json()
      if (data.success) {
        setIsResettingPassword(false)
        setIsAuthenticated(true)
        localStorage.setItem('isAuthenticated', 'true')
        setError('')
        await fetchSubmissions()
        router.push('/admin')
        setDebugInfo(prev => prev + '\nPassword reset successfully')
      } else {
        setError(data.error || 'Failed to reset password')
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
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
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
                    name="new-password"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Input
                    id="confirmPassword"
                    name="new-password"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">Set Password</Button>
            </CardFooter>
          </form>
          {error && <p className="text-red-500 text-center mt-2 px-6">{error}</p>}
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
                    name="new-password"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Input
                    id="confirmPassword"
                    name="new-password"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">Reset Password</Button>
            </CardFooter>
          </form>
          {error && <p className="text-red-500 text-center mt-2 px-6">{error}</p>}
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
            <CardTitle className="flex items-center justify-between">
              <span>Email Submissions</span>
              {isLoadingSubmissions && <span className="text-sm text-muted-foreground">Loading...</span>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {submissionsError ? (
              <p className="text-red-500 text-center py-4">{submissionsError}</p>
            ) : isLoadingSubmissions ? (
              <p className="text-center py-4">Loading submissions...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <SubmissionsTable submissions={submissions} />
              </Table>
            )}
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
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button type="submit" className="w-full">Login</Button>
            <Button type="button" variant="outline" onClick={handleGenerateResetToken} className="w-full">
              Forgot Password
            </Button>
          </CardFooter>
        </form>
        {resetEmailSent && (
          <p className="text-green-500 text-center mt-2 px-6">Reset email sent. Please check your inbox.</p>
        )}
        {error && <p className="text-red-500 text-center mt-2 px-6">{error}</p>}
      </Card>
      <div className="fixed bottom-4 left-4 bg-gray-800 text-white p-4 rounded">
        <h3 className="font-bold mb-2">Debug Info:</h3>
        <pre className="whitespace-pre-wrap">{debugInfo}</pre>
      </div>
    </div>
  )
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Admin page error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Something went wrong</CardTitle>
              <CardDescription>Please try refreshing the page</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => window.location.reload()} 
                className="w-full"
              >
                Refresh Page
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <ErrorBoundary>
        <AdminContent />
      </ErrorBoundary>
    </Suspense>
  )
}