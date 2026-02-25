/** @type {import('next').NextConfig} */
const dotenv = require("dotenv");
dotenv.config({ path: "../../.env" });

module.exports = {
  transpilePackages: [
    "@repo/ui",
    "@repo/provider",
    "@repo/modules",
    "@repo/types",
  ],
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    SASHIDO_API_URL:
      "https://pg-app-uefbsna5l6ijyse42wipewpjwu804d.scalabl.cloud/1/",
    SASHIDO_GQL_URL:
      "https://pg-app-uefbsna5l6ijyse42wipewpjwu804d.scalabl.cloud/graphql/",
    SASHIDO_APP_ID: "6UL6mWiTgB6z9zsk4VDPwFghIDMg6q4qRQQXTaSl",
    SASHIDO_REST_KEY: "NkcV3C5kwXFrmi2WjnAcK1TEEQPQqhg4RSM6kQqq",
    SASHIDO_MASTER_KEY: "xeAPUQ5V801pU7kBfY3condMnGqQ8O6hQ4DqRSgQ",
    SASHIDO_JS_KEY: "Ju3b7rDC9yD32R1mUXrgAtgJDQMRQi54q4sgSq6h",
    SASHIDO_FILE_URL:
      "https://uefbsna5l6ijyse42wipewpjwu804d.files-sashido.cloud/",
    SASHIDO_CLIENT_KEY: "51W77ssEooxl3BPTf1BH0mbQqDRQVMgqqFM64hQS",
    BYTESCALE_ACCOUNT_ID: process.env.BYTESCALE_ACCOUNT_ID,
    BYTESCALE_PUBLIC_KEY: process.env.BYTESCALE_PUBLIC_KEY,
    BYTESCALE_SECRET_KEY: process.env.BYTESCALE_SECRET_KEY,
    APP_NAME: "patstore",
    SESSION_TOKEN: "patstore_token",
    FIREBASE_API_KEY: "AIzaSyBC8ysrORfhs72H6zkAlR1-Atz0zKcSM34",
    FIREBASE_AUTH_DOMAIN: "patwork-3b6d7.firebaseapp.com",
    FIREBASE_PROJECT_ID: "patwork-3b6d7",
    FIREBASE_STORAGE_BUCKET: "patwork-3b6d7.firebasestorage.app",
    FIREBASE_MESSAGING_SENDER_ID: "445175682675",
    FIREBASE_APP_ID: "1:445175682675:web:6ed3c4338b541979e5fc06",
    // FIREBASE_MEASUREMENT_ID: 'G-32QEKHD6FM',
    GCMS_SENDER_ID: "445175682675",
    NEXT_PUBLIC_LETTERMINT_API_KEY: process.env.NEXT_PUBLIC_LETTERMINT_API_KEY,
    NEXT_PUBLIC_LETTERMINT_KEY: "lm_team_p6pGcbe9uuZrlTnBZAoRIGoA1UsHyecHSW8zjYeo"
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uefbsna5l6ijyse42wipewpjwu804d.files-sashido.cloud",
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
