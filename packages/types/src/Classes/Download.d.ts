import { ClassProperties } from './Classes';

export type DownloadClass = ClassProperties & {
    title: string,
    image: string,
    file: string,
    info: string,
}
