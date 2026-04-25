import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://your-namecheap-domain.com', // Replace with your domain
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
    ]
}