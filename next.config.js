/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    distDir: 'build',
    basePath: '', // Keep empty for GitHub Pages root deployment
    images: {
        unoptimized: true // Required for static export
    },
    trailingSlash: true
}

module.exports = nextConfig