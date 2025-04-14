import { ApolloRefetch } from "@repo/types";

export interface DnDProps<T> {
	items: T;
	ItemComponent: React.FC<{ item: DnDItem; id: DnDItem.id }>;
	objectClass?: string;
	componentStyles?: (item: DnDItem) => object | null;
	subField?: { id: string; field: string };
	onChange?: (items: T) => void;
	refetch?: ApolloRefetch;
}

export type Sortable_Type = {
	id: DnDItem.id;
	item: DnDItem;
	ItemComponent: React.FC<{ item: DnDItem; id: DnDItem.id }>;
	componentStyles?: (item: DnDItem) => object | null;
};
