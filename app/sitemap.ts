import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date('2024-01-01')
  
  return [
    {
      url: 'https://punderous.com',
      lastModified,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://punderous.com/privacy-policy',
      lastModified,
      changeFrequency: 'monthly', 
      priority: 0.8,
    },
    {
      url: 'https://punderous.com/not-found',
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    }
  ]
}