import { ClassProperties } from "./Classes";

export type WebpageClass = ClassProperties & {
    path: string;
    title: string;
    type: string;
    subtitle: string;
    content: WebpageContent[];
    active: boolean;
    image: string;
    documents: string[];
};



export type WebpageContentText = {
    name: string;
    id: string;
    type: 'text';
    position: number;
    text: string;
    url: null;
    active: boolean;
}

export type WebpageContentImage = {
    name: string;
    id: string;
    type: 'image';
    position: number;
    text: string;
    url: string;
    active: boolean;
    image: string;
}
export type WebpageContentVideo = {
    name: string;
    id: string;
    type: 'video';
    position: number;
    text: string;
    url: string;
    active: boolean;
    video: string;
}

export type WebpageContent = (WebpageContentText | WebpageContentImage | WebpageContentVideo);
