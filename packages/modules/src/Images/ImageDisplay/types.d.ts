import { Image } from "@repo/types"

export type ImageDisplayProps = {
    image: Image,
    deleteHandler?: (I: Image) => void
}

export type DeleteImageHandlerProps = {
    accountId: string,
    apiKey: string,
    filePath: string
}