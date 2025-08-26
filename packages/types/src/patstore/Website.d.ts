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
};

export type WebpageContentImage = {
    name: string;
    id: string;
    type: 'image';
    position: number;
    text: string;
    url: string;
    active: boolean;
    image: string;
};

export type WebpageContentVideo = {
    name: string;
    id: string;
    type: 'video';
    position: number;
    text: string;
    url: string;
    active: boolean;
    video: string;
};

export type WebpageContentTable = {
    name: string;
    id: string;
    type: 'table';
    position: number;
    text: string;
    url: string;
    active: boolean;
    video: string;
    table: string;
};

export type WebpageContentDivider = {
    name: string;
    id: string;
    type: 'divider';
    position: number;
    active: boolean;
    divider: {
        size: "small" | "medium" | "large";
        showLine: boolean;
    }
};

export type WebpageContent = (
    WebpageContentText | 
    WebpageContentImage | 
    WebpageContentVideo | 
    WebpageContentTable |
    WebpageContentDivider
);

export type WebpageComponentTable = {
    columns: {name: string, id: string, textAlign: string}[];
    rows: {data: {[key: number]: string}, id: string}[];
    settings: {
        title: string;
        description: string;
        footer: string;
        showHeader: boolean;
    }
}

export type WebpageComponentFaq = {
     settings: {
        title: string;
        description: string;
        footer: string;
        showHeader: boolean;
    },
    elements: {
        header: string;
        content: string;
    }[]
}

export type WebpageComponents =  (
    WebpageComponentTable | 
    WebpageComponentFaq
)
