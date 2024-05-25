/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: ["@repo/ui", "@repo/provider"],
  env: {
    SASHIDO_API_URL: process.env.SASHIDO_API_URL,
    SASHIDO_APP_ID: process.env.SASHIDO_APP_ID,
    SASHIDO_REST_KEY: process.env.SASHIDO_REST_KEY,
    SASHIDO_MASTER_KEY: process.env.SASHIDO_MASTER_KEY,
    SASHIDO_FILE_URL: process.env.SASHIDO_FILE_URL,
    SASHIDO_CLIENT_KEY: process.env.SASHIDO_CLIENT_KEY,
  },
};
