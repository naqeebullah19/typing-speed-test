import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
            },
            {
                userAgent: 'facebookexternalhit', // Explicitly welcoming Facebook
                allow: '/',
            }
        ],
        sitemap: 'https://typingspeedtest.live/sitemap.xml',
    }
}