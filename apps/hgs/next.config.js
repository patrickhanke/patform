/** @type {import('next').NextConfig} */

const nextConfig = {
	typescript: {
		ignoreBuildErrors: true
	},
	env: {
		SASHIDO_API_URL: 'https://pg-app-ks588wtqbcwvgvbc096gr40cedytjy.scalabl.cloud/1/',
		SASHIDO_APP_ID: '6Soqn6XEf2By4YAa2WN9YV9pNk3hT7dTNFOAVYaQ',
		SASHIDO_REST_KEY: 'ARh0DqKEdWYDXb0mVNM50W5nQhNb7TVA9fpNF3dk',
		SASHIDO_MASTER_KEY:  'ya02fyyVMVoqFC3rtzgrckdF3VrQN3hk9TNpPdRA',
		SASHIDO_FILE_URL:  'https://ks588wtqbcwvgvbc096gr40cedytjy.files-sashido.cloud/',
		SASHIDO_CLIENT_KEY: 'Ie7BJ19MtDnEREkISIAnidh9hQrfdANk7p33VNFT',
		BYTESCALE_ACCOUNT_ID: 'FW25c4N',
		BYTESCALE_PUBLIC_KEY: 'public_FW25c4N3qgCzxTQoAXJY5CbtXHZf',
		BYTESCALE_SECRET_KEY: 'secret_FW25c4NG3DufL64qbUVs4y91SAuX'
	},
	eslint: {
		ignoreDuringBuilds: true
	},
	images: {
		remotePatterns:[
			{ 
				protocol: 'https',
				hostname: 'ks588wtqbcwvgvbc096gr40cedytjy.files-sashido.cloud/',
				port: '',
				pathname: '/**'
			}
		]
	}
};

// eslint-disable-next-line no-undef
module.exports = nextConfig;
