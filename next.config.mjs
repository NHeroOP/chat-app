/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    AUTH_SECRET: process.env.AUTH_SECRET,
  }
};

export default nextConfig;
