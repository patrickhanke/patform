import * as Bytescale from "@bytescale/sdk";

export const getImageUrl = ({
  filePath,
  height,
  width,
}: {
  filePath: string;
  height?: number;
  width?: number;
}): string => {
  let url = "";
  if (!width && !height) {
    url = Bytescale.UrlBuilder.url({
      accountId: process.env.BYTESCALE_ACCOUNT_ID as string,
      filePath,
    });
  }

  if (width && !height) {
    url = Bytescale.UrlBuilder.url({
      accountId: process.env.BYTESCALE_ACCOUNT_ID as string,
      filePath,
      options: {
        transformation: "image",
        transformationParams: {
          w: width,
          fit: width ? "max" : "height",
        },
      },
    });
  }

  if (width && height) {
    url = Bytescale.UrlBuilder.url({
      accountId: process.env.BYTESCALE_ACCOUNT_ID as string,
      filePath,
      options: {
        transformation: "image",
        transformationParams: {
          w: width,
          h: height,
          fit: "crop",
          cro: "center",
        },
      },
    });
  }

  if (!width && height) {
    url = Bytescale.UrlBuilder.url({
      accountId: process.env.BYTESCALE_ACCOUNT_ID as string,
      filePath,
      options: {
        transformation: "image",
        transformationParams: {
          h: height,
          fit: height ? "height" : "max",
        },
      },
    });
  }

  return url;
};

export const getFileUrl = (filePath: string) => {
  return Bytescale.UrlBuilder.url({
    accountId: process.env.BYTESCALE_ACCOUNT_ID as string,
    filePath,
  });
};
