import { ApolloRefetch } from "@repo/types";
import { FormField } from "../CreateField/types";

export type FormFieldProps = {
    field: FormField,
    formId: string,
    refetch: ApolloRefetch,
    fields: FormField[]
}