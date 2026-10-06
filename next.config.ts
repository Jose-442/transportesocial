import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Una foto de la mascota o del bulto puede pasar de 1 MB. Sin esto el envío se corta y el botón se queda en «Publicando».
  serverActions: {
    bodySizeLimit: "4mb",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
