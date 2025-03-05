import { ClassProperties } from './Classes';

export type Recipient = {
    email: string,
    name: string,
    id: string
}

export type FormClass = ClassProperties & {
    name: string,
    fields: Field[],
    description: string,
    settings: {
        recipients: Recipient[],
        response: boolean,
        static_form: boolean,
        notification: boolean,
        notification_text: string
    }
}