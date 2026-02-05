/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.trycloudflare.com', // Permite cualquier túnel de hoy o mañana
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // (Opcional) Por si usas otros servicios
      },
    ],
  },
};

export default nextConfig;