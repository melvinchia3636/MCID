/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/items',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
