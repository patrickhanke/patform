import { ClassProperties } from './Classes';

export type GroupClass = ClassProperties & {
    title: string,
    image: string,
    state: string,
    contact: string,
    info: string,
    description: string,
    persons: string[]
}
