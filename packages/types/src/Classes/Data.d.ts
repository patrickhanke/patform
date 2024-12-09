import { ClassProperties } from './Classes';


export type FormDataClass = ClassProperties & {
    data: {[key: string]: any};
    reference: string;
}