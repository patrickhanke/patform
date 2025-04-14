import { ClassProperties } from "./Classes";

export type WebpageClass = ClassProperties & {
    name: string;
    title: string;
    type: string;
    subtitle: string;
    content: WebpageContent[];
};

export type WebpageContentText = {
    name: string;
    id: string;
    type: 'text';
    position: number;
    text: string;
    image: null;
}

export type WebpageContentImage = {
    name: string;
    id: string;
    type: 'image';
    position: number;
    text: string;
    image: string;
}

export type WebpageContent = (WebpageContentText | WebpageContentImage);
