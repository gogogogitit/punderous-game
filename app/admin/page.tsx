'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Submission {
  id: number
  email: string
  comment: string | null
  created_at: string
}

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const res = await fetch('/api/submit-email')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setSubmissions(data)
      } catch (err) {
        setError('Failed to load submissions')
        console.error(err)
      }
    }
    fetchSubmissions()
  }, [])

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Email Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="space-y-4">
              {submissions.map(sub => (
                <div key={sub.id} className="border p-4 rounded">
                  <p><strong>Email:</strong> {sub.email}</p>
                  <p><strong>Comment:</strong> {sub.comment || 'N/A'}</p>
                  <p><strong>Date:</strong> {new Date(sub.created_at).toLocaleString()}</p>
                </div>
              ))}
              {submissions.length === 0 && (
                <p>No submissions yet</p>
              )}
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