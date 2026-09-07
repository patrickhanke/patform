"use client";

import { FC, useMemo, useState } from "react";
import { Table, usePageData } from "@repo/ui";
import { EmailList, Filter, Module, PatstoreUser } from "@repo/types";
import { useFindDataSecure } from "@repo/provider";
import EditFilter from "./components/EditFilter";

export interface ListFilterProps {
	list: EmailList;
	userModule: Module | undefined;
}

const ListFilter: FC<ListFilterProps> = ({ list, userModule }) => {
	const { data, setData } = usePageData<EmailList["settings"]>(
		{
			objectId: list.objectId,
			initialData: {
				...list.settings
			}
		},
		{
			className: "Email",
			updateObject: (data) => {
				return {
					settings: {
						...data,
						filters: data.filters || []
					}
				};
			}
		}
	);

	const initialFilters: Filter[] = useMemo(
		() => [
			{
				key: "projects",
				value: [list.project.objectId],
				operator: "in"
			},
			{
				key: "is_superuser",
				value: true,
				operator: "notEqualTo"
			}
		],
		[]
	);

	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	});

	const {
		data: users,
		count,
		loading
	} = useFindDataSecure({
		objectName: "User",
		fields: ["objectId", "first_name", "last_name", "email"],
		filters: [...initialFilters, ...(data?.filters || [])] as Filter[],
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize,
		order: "label_ASC",
		useMasterKey: true
	});

	const columns = useMemo(
		() => [
			{
				header: "Vorname",
				accessorKey: "first_name",
				cell: ({ row }: { row: { original: PatstoreUser } }) =>
					row.original.first_name
			},
			{
				header: "Nachname",
				accessorKey: "last_name",
				cell: ({ row }: { row: { original: PatstoreUser } }) =>
					row.original.last_name
			},
			{
				header: "Email",
				accessorKey: "email",
				cell: ({ row }: { row: { original: PatstoreUser } }) =>
					row.original.email
			}
		],
		[]
	);

	if (!userModule) {
		return <div>Lädt ...</div>;
	}

	return (
		<div className="flex col a-st gap-md">
			<div className="flex col gap-sm">
				<h3>Listenfilter</h3>
				<p>
					Definieren Sie, welche Nutzer in der Liste enthalten sind.
					Die Liste enthält <strong>{count}</strong> Nutzer.
				</p>
			</div>

			<EditFilter
				filters={data?.filters || []}
				onSave={(filters) => setData("filters", filters)}
				userModule={userModule}
			/>

			<Table
				columns={columns}
				data={users ?? users ?? []}
				setPagination={setPagination}
				pagination={pagination}
				rowCount={count}
				filters={data?.filters || []}
				setFilters={(filters) =>
					setData("filters", filters as Filter[])
				}
				loading={loading}
			/>
		</div>
	);
};

export default ListFilter;
