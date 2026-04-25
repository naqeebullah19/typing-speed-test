import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://typingspeedtest.live', // Replace with your domain
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
    ]
}