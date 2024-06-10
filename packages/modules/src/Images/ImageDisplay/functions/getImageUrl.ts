import * as Bytescale from '@bytescale/sdk';

const getImageUrl = ({filePath, height = 80, width=45}: {filePath: string, height?: number, width?: number}) => {
    const url = Bytescale.UrlBuilder.url({
        accountId: process.env.BYTESCALE_ACCOUNT_ID as string,
        filePath: filePath,
        options: {
            transformation: 'image',
            transformationParams: {
                'w': width,
                'h': height
            }
        }
    });

    return url;

};

export default getImageUrl;