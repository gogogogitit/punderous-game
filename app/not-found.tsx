'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NotFound() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/')
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#00B4D8] text-white">
      <h1 className="text-4xl font-bold mb-4">404-get about it! Page Not Found</h1>
      <p className="text-xl mb-8">Punfortunately the page you're looking for doesn't exist.</p>
      <p className="text-lg mb-4">You'll be redirected to the game page in 5 seconds...</p>
      <Link href="/" className="text-lg underline hover:text-[#FFD151]">
        Go back to home
      </Link>
    </div>
  )
}