import { headers } from 'next/headers'

export function getServerBaseUrl() {
  try {
    const headersList = headers()
    const host = headersList.get('host')
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    return `${protocol}://${host}`
  } catch {
    return process.env.NEXT_PUBLIC_BASE_URL || 'https://punderous.com'
  }
} 