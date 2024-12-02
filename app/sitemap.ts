import { MetadataRoute } from 'next'
import { getServerBaseUrl } from '@/lib/server-utils'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getServerBaseUrl()
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ]
}