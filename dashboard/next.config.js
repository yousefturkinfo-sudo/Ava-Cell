/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        // Disable static optimization to fix SSR errors
        workerThreads: false,
        cpus: 1
    },
    // Disable static page generation for error pages
    generateBuildId: async () => {
        return 'build-' + Date.now()
    },
    // Add explicit runtime configuration
    reactStrictMode: true,
}

module.exports = nextConfig
