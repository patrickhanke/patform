import { ClassProperties, ClassState } from './Classes';

export type ArticleClass = ClassProperties & {
    title: string,
    image: string,
    createdAt: string,
    text: string,
    gallery: string[],
    date: string,
    state: ClassState['value']
}