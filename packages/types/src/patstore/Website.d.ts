import { ClassProperties } from "./Classes";

export type WebpageClass = ClassProperties & {
    name: string;
    title: string;
    type: string;
    subtitle: string;
};

export type WebpageContentText = {
    id: string;
    type: 'text';
    text: string;
}

export type WebpageContentImage = {
    id: string;
    type: 'image';
    image: string;
}

export type WebpageContent = (WebpageContentText | WebpageContentImage)[];
