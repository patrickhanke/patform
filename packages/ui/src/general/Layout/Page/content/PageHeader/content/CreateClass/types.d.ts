import { Field } from "@repo/ui";
import { ApolloRefetch } from "@repo/types";

export type CreateClassProps<T> = {
	initialData: { [key: keyof T]: any };
	fields: Field[];
	text: string;
	className: string;
	refetch?: ApolloRefetch;
};
