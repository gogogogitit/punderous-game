import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://punderous.com'
  const lastUpdated = '2024-01-01'
  
  return [
    {
      url: baseUrl,
      lastModified: lastUpdated,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: lastUpdated,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/not-found`,
      lastModified: lastUpdated,
      changeFrequency: 'yearly',
      priority: 0.3,
    }
  ]
}