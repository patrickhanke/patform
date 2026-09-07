"use client";

import { FC, useCallback, useMemo, useState } from "react";
import { IconButton, Table, usePageData } from "@repo/ui";
import { EmailList, Filter, Module, PatstoreUser } from "@repo/types";
import { useFindDataSecure } from "@repo/provider";

export interface ListMembersProps {
	list: EmailList;
	userModule: Module;
}

const ListMembers: FC<ListMembersProps> = ({ list, userModule }) => {
	console.log(list.settings);
	const { data, setData } = usePageData<EmailList["settings"]>(
		{
			objectId: list.objectId,
			initialData: {
				...list.settings,
				recipients: list.settings.recipients || []
			}
		},
		{
			className: "Email",
			updateObject: (data) => {
				return {
					settings: {
						...data,
						recipients: data.recipients || []
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

	const [filters, setFilters] = useState<Filter[]>([]);

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
		filters: [...initialFilters, ...filters] as Filter[],
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

	const viewAllFilterHandler = useCallback(() => {
		if (filters.find((filter) => filter.key === "objectId")) {
			const newFilters = filters.filter(
				(filter) => filter.key !== "objectId"
			);
			setFilters(newFilters);
		} else {
			setFilters([
				...filters,
				{
					key: "objectId",
					value: data?.recipients || [],
					operator: "in"
				}
			]);
		}
	}, [data?.recipients, filters]);

	return (
		<div className="flex col a-st gap-md">
			<div className="flex row gap-sm w-100 j-sb">
				<p>
					Die Liste enthält{" "}
					<strong>{data?.recipients?.length}</strong> Nutzer.
				</p>
				<IconButton
					text={
						filters.find((filter) => filter.key === "objectId")
							? "Alle anzeigen"
							: "Ausgewählte anzeigen"
					}
					icon={
						filters.find((filter) => filter.key === "objectId")
							? "eye"
							: "eye-off"
					}
					onClick={() => viewAllFilterHandler()}
				/>
			</div>

			<Table
				columns={columns}
				data={users ?? []}
				setPagination={setPagination}
				pagination={pagination}
				rowCount={count}
				filters={filters}
				setFilters={setFilters}
				filterColumns={userModule.filters}
				loading={loading}
				selectedRows={data?.recipients || []}
				setSelectedRows={(recipients) =>
					setData("recipients", recipients as string[])
				}
				enableRowSelection
			/>
		</div>
	);
};

export default ListMembers;
