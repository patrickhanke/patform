/** @type {import('next').NextConfig} */
module.exports = {
	transpilePackages: ['@repo/ui', '@repo/provider'],
	typescript: {
		ignoreBuildErrors: true
	},
	env: {
		SASHIDO_API_URL: process.env.SASHIDO_API_URL,
		SASHIDO_APP_ID: process.env.SASHIDO_APP_ID,
		SASHIDO_REST_KEY: process.env.SASHIDO_REST_KEY,
		SASHIDO_MASTER_KEY: process.env.SASHIDO_MASTER_KEY,
		SASHIDO_FILE_URL: process.env.SASHIDO_FILE_URL,
		SASHIDO_CLIENT_KEY: process.env.SASHIDO_CLIENT_KEY,
		BYTESCALE_ACCOUNT_ID: process.env.BYTESCALE_ACCOUNT_ID,
		BYTESCALE_PUBLIC_KEY: process.env.BYTESCALE_PUBLIC_KEY,
		BYTESCALE_SECRET_KEY: process.env.BYTESCALE_SECRET_KEY,
		BYTESCALE_IMAGE_FOLDER: 'admin'
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
