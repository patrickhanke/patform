import { ApolloRefetch, ModuleField } from "@repo/types";

export type CreateClassProps<T> = {
	initialData: {
		[key: keyof T]: string | number | boolean | object;
	};
	fields: ModuleField[];
	text: string;
	className: string;
	refetch?: ApolloRefetch;
};
