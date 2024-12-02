import { MetadataRoute } from 'next'
import { getServerBaseUrl } from '../lib/server-utils'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getServerBaseUrl()
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}