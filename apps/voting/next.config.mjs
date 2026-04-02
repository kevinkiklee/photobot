/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingIncludes: {
    '/**': ['../../node_modules/.prisma/client/**', '../../node_modules/@prisma/client/**'],
  },
};

export default nextConfig;
