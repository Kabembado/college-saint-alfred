/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Autorise l'envoi de photos d'enseignants (2 Mo max) via les formulaires.
    serverActions: { bodySizeLimit: '3mb' },
  },
  images: { unoptimized: true },
};

export default nextConfig;
