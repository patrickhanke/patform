import { ClassProperties } from "./Classes";
import FormField from '../../../modules/src/patstore/Form/Form/content/FormFields/content/FormField/FormField';

export type Recipient = {
  email: string;
  name: string;
  id: string;
};

export type FormClass = ClassProperties & {
    name: string;
    fields: FormField[];
    description: string;
    settings: {
        recipients: Recipient[];
        response: boolean;
        static_form: boolean;
        notification: boolean;
        notification_text: string;
        sender_email: string;
        server: {
            host: string;
            port: number;
            username: string;
            password: string;
            secure: boolean;
            requireTLS: boolean;
            auth: boolean;
            from: string;

        }
    };
};
