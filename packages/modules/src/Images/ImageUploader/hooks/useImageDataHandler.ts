import { useDataHandler } from "@repo/provider";
import { Image } from "@repo/types";
import deleteImageHandler from "../../ImageDisplay/functions/deleteImage";
import { UseImageDataHandler } from "../types";

const useImageDataHandler: UseImageDataHandler = (afterSaveFunction, afterCancelFunction) => {
    const { createData } = useDataHandler();
    
    const imageUploadHandler = async (images: string[]) => {
        const uploadArray = images.map(async (image) => {
            await createData({
                className: 'Image', 
                updateObject: { 
                    name: 'Neues Bild',
                    filePath: image 
                }
            });
        });

        await Promise.all(uploadArray)

        if (afterSaveFunction) {
            afterSaveFunction();
        }

        return null;
    };

    const imageUploadCancelHandler = async (images: string[]) => {
        await Promise.all(images.map(async (image: string) => {
            deleteImageHandler({
                accountId: process.env.BYTESCALE_ACCOUNT_ID as string,
                apiKey: process.env.BYTESCALE_SECRET_KEY as string,
                filePath: image
            
            }).then(
                error => console.error(error)
            );
        }));
        
        if (afterCancelFunction) {
            afterCancelFunction();
        }
    };

    
    return {
        imageUploadHandler,
        imageUploadCancelHandler,
    };
    }

export default useImageDataHandler;