/** @type {import('next').NextConfig} */
module.exports = {
	transpilePackages: ['@repo/ui', '@repo/provider'],
	typescript: {
		ignoreBuildErrors: true
	},
	env: {
		SASHIDO_API_URL: process.env.SASHIDO_API_URL,
		SASHIDO_GQL_URL: process.env.SASHIDO_GQL_URL,
		SASHIDO_APP_ID: process.env.SASHIDO_APP_ID,
		SASHIDO_REST_KEY: process.env.SASHIDO_REST_KEY,
		SASHIDO_MASTER_KEY: process.env.SASHIDO_MASTER_KEY,
		SASHIDO_FILE_URL: process.env.SASHIDO_FILE_URL,
		SASHIDO_CLIENT_KEY: process.env.SASHIDO_CLIENT_KEY,
		BYTESCALE_ACCOUNT_ID: process.env.BYTESCALE_ACCOUNT_ID,
		BYTESCALE_PUBLIC_KEY: process.env.BYTESCALE_PUBLIC_KEY,
		BYTESCALE_SECRET_KEY: process.env.BYTESCALE_SECRET_KEY,
		APP_NAME: 'patsore',
		SESSION_TOKEN: 'patstore_token',
		BYTESCALE_IMAGE_FOLDER: 'patstore',
		PROJECT_ID: 'lt4HonzqK3',
		FIREBASE_API_KEY: 'AIzaSyBC8ysrORfhs72H6zkAlR1-Atz0zKcSM34',
		FIREBASE_AUTH_DOMAIN: 'patwork-3b6d7.firebaseapp.com',
		FIREBASE_PROJECT_ID: 'patwork-3b6d7',
		FIREBASE_STORAGE_BUCKET: 'patwork-3b6d7.firebasestorage.app',
		FIREBASE_MESSAGING_SENDER_ID: '445175682675',
		FIREBASE_APP_ID: '1:445175682675:web:6ed3c4338b541979e5fc06',
		// FIREBASE_MEASUREMENT_ID: 'G-32QEKHD6FM',
		GCMS_SENDER_ID: '445175682675'
	},
	images: {
		remotePatterns:[
			{ 
				protocol: 'https',
				hostname: 'uefbsna5l6ijyse42wipewpjwu804d.files-sashido.cloud',
				port: '',
				pathname: '/**'
			}
		]
	}
};
