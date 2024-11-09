'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function SubmissionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccess(false)

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email')
    const comment = formData.get('comment')

    try {
      const response = await fetch('/api/submit-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, comment }),
      })

      if (!response.ok) {
        throw new Error('Submission failed')
      }

      setSuccess(true)
      event.currentTarget.reset()
    } catch (err) {
      setError('Failed to submit. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          name="email"
          placeholder="Your email"
          required
          disabled={isSubmitting}
        />
        <Textarea
          name="comment"
          placeholder="Your comment"
          disabled={isSubmitting}
        />
        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
      
      {error && (
        <p className="mt-4 text-sm text-red-600">{error}</p>
      )}
      
      {success && (
        <p className="mt-4 text-sm text-green-600">
          Thank you for your submission!
        </p>
      )}
    </div>
  )
}