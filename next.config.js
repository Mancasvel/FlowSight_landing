/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  serverExternalPackages: ['mongoose', 'mongodb'],
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'recharts',
      '@supabase/supabase-js',
    ],
  },
}

module.exports = nextConfig
