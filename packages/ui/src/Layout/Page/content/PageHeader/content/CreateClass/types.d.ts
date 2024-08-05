import { Field } from '@repo/ui';

export type CreateClassProps = {
    fields: Field[];
    text: string;
    className: string;
    refetch?: () => void;
};