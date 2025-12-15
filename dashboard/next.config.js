/** @type {import('next').NextConfig} */
const nextConfig = {
    // Use standalone output to avoid SSR issues
    output: 'standalone',
    // Disable static page generation
    experimental: {
        runtime: 'nodejs',
    },
    // Add explicit runtime configuration
    reactStrictMode: true,
}

module.exports = nextConfig
