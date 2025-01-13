import * as Bytescale from '@bytescale/sdk';

const getImageUrl = (filePath: string, width = 80, height = 45) =>  {
	let url = '';

	if (width && !height) {
		url = Bytescale.UrlBuilder.url({
			accountId: process.env.BYTESCALE_ACCOUNT_ID as string,
			filePath,
			options: {
				transformation: 'image',
				transformationParams: {
					w: width,
					fit: width ? 'max' : 'height'
				}
			}
		});
	}

	if (width && height) {
		url = Bytescale.UrlBuilder.url({
			accountId: process.env.BYTESCALE_ACCOUNT_ID as string,
			filePath,
			options: {
				transformation: 'image',
				transformationParams: {
					w: width,
					h: height,
					fit: 'crop',
					cro: 'center'
				}
			}
		});
	}

	return url;
};

export default getImageUrl;