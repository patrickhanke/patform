import { ClassProperties } from './Classes';

export type FormClass = ClassProperties & {
    name: string,
    fields: Field[],
    description: string,
}