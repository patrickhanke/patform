/** @type {import('next').NextConfig} */

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    SASHIDO_API_URL:
      "https://pg-app-ks588wtqbcwvgvbc096gr40cedytjy.scalabl.cloud/1/",
    SASHIDO_APP_ID: "6Soqn6XEf2By4YAa2WN9YV9pNk3hT7dTNFOAVYaQ",
    SASHIDO_GQL_URL:
      "https://pg-app-ks588wtqbcwvgvbc096gr40cedytjy.scalabl.cloud/graphql/",
    SASHIDO_REST_KEY: "ARh0DqKEdWYDXb0mVNM50W5nQhNb7TVA9fpNF3dk",
    SASHIDO_MASTER_KEY: "ya02fyyVMVoqFC3rtzgrckdF3VrQN3hk9TNpPdRA",
    SASHIDO_FILE_URL:
      "https://ks588wtqbcwvgvbc096gr40cedytjy.files-sashido.cloud/",
    SASHIDO_CLIENT_KEY: "Ie7BJ19MtDnEREkISIAnidh9hQrfdANk7p33VNFT",
    BYTESCALE_ACCOUNT_ID: "FW25c4N",
    SASHIDO_JS_KEY: "sdz5K3XFXMwb4vatxyO0v8NdNpkOKi9QhTVF34OA",
    APP_NAME: "patflow",
    BYTESCALE_PUBLIC_KEY: "public_FW25c4N3qgCzxTQoAXJY5CbtXHZf",
    BYTESCALE_SECRET_KEY: "secret_FW25c4NG3DufL64qbUVs4y91SAuX",
    SESSION_TOKEN: "patflow_session_token",
    INSTALLATION_ID: "patflow_installation_id",
    FIREBASE_API_KEY: "AIzaSyARUPJePB7XFzxliXn8QoBFT79lnJ4u8Ko",
    FIREBASE_AUTH_DOMAIN: "hgs-app-d35b1.firebaseapp.com",
    FIREBASE_PROJECT_ID: "hgs-app-d35b1",
    FIREBASE_STORAGE_BUCKET: "hgs-app-d35b1.firebasestorage.app",
    FIREBASE_MESSAGING_SENDER_ID: "641842391250",
    FIREBASE_APP_ID: "1:641842391250:web:af88774f5d9e0aac01250b",
    FIREBASE_MEASUREMENT_ID: "G-32QEKHD6FM",
    GCMS_SENDER_ID: "641842391250",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ks588wtqbcwvgvbc096gr40cedytjy.files-sashido.cloud",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upcdn.io",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
