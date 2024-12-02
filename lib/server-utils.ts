import { headers } from 'next/headers'

export function getServerBaseUrl() {
  try {
    const headersList = headers()
    const host = headersList.get('host')
    const cleanHost = host?.replace(/^www\./, '') || 'punderous.com'
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    return `${protocol}://${cleanHost}`
  } catch {
    return 'https://punderous.com'
  }
}