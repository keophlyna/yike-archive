/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Entry photos live in the Supabase Storage bucket "photos", so
    // photo_url values are remote. next/image refuses remote hosts that are
    // not listed here. The wildcard covers any Supabase project.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};

export default nextConfig;
