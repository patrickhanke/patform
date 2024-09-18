export type CreateClassProps<T> = ({
    initialData: T;
    fields: Field[];
    className: string;
    refetch: () => void;
})