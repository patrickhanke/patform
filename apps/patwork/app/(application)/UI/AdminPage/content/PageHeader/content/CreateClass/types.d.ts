import { Field } from '@repo/ui';

export type CreateClassProps<T> = {
    initialData: {[key: keyof T]: any };
    fields: Field[];
    text: string;
    className: string;
    refetch?: () => void;
    projectId?: string;
};