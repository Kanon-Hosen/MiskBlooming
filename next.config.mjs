/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // This suppresses the "canvas" import error which is a dependency of react-pdf
    config.resolve.alias.canvas = false;
    return config;
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"], //  AVIF first for best compression
    deviceSizes: [320, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, //  Long cache for images
    dangerouslyAllowSVG: false, //  Disable for security unless absolutely needed
    contentSecurityPolicy:
      "default-src 'self'; img-src * data: blob:; media-src * data: blob:; style-src 'self' 'unsafe-inline'; font-src *; frame-src *; connect-src *; script-src 'self' 'unsafe-inline';",
  },

  experimental: {
    optimizeCss: true,
    outputFileTracingIncludes: {
      '/api/dashboard-report': ['./public/fonts/**/*'],
    },
    turbo: {
      rules: {
        "*.svg": ["@svgr/webpack"], //  Optimize inline SVGs
      },
    },
    serverExternalPackages: ["pdfkit", "argon2"],
    optimizePackageImports: [
      "lucide-react",
      "react-icons",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-toast",
      "@radix-ui/react-scroll-area",
      "framer-motion",
      "sonner",
      "@tanstack/react-query",
      "@apollo/client",
      "zustand",
      "date-fns",
    ],
    scrollRestoration: true, //  Better navigation UX
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
    styledComponents: true, //  If you use styled-components
  },

  compress: true,
  poweredByHeader: false, //  Hide "X-Powered-By" header
  generateEtags: true, //  Better caching
  httpAgentOptions: { keepAlive: true }, //  Improves API performance
};

export default nextConfig;
