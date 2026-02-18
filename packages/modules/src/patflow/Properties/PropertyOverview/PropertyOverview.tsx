"use client";

import { useDataHandler, useFindData } from "@repo/provider";
import React, {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState
} from "react";
import useTableColumns from "./hooks/useTableColumns";
import CreatePropterty from "./components/CreateProperty";
import initialData from "./constants/initialData";
import { Page, Table } from "@repo/ui";
import { UserContext } from "@repo/provider";
import { Filter } from "@repo/types";
import { ColumnData } from "@repo/ui";
import { Property } from "@repo/types";

const baseFilters: Filter[] = [
	{
		key: "archived",
		value: true,
		operator: "notEqualTo"
	}
];

const filterColumns: ColumnData<Property>[] = [
	{ id: "name", label: "Name", type: "edit_string" },
	{ id: "createdAt", label: "Erstellt am", type: "date" }
];

const PropertyOverview = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [filters, setFilters] = useState<Filter[]>([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 20
	});
	const [order, setOrder] = useState<string>("createdAt_DESC");
	const { user, projectId } = useContext(UserContext);

	const allFilters = useMemo(() => [...baseFilters, ...filters], [filters]);

	const { data, refetch, count } = useFindData({
		objectName: "Property",
		fields: [
			"objectId",
			"name",
			"createdAt",
			"created_by {objectId username}",
			"archived"
		],
		projectId,
		filters: allFilters,
		skip: pagination.pageIndex * pagination.pageSize,
		limit: pagination.pageSize,
		order
	});

	useEffect(() => {
		setPagination((prev) => ({ ...prev, pageIndex: 0 }));
	}, [filters, order]);

	const { createData } = useDataHandler();

	const columns = useTableColumns();

	const createObjectHandler = useCallback(
		async (data: typeof initialData) => {
			await createData({
				className: "Property",
				updateObject: {
					name: data.name,
					settings: { key: false },
					project: {
						__type: "Pointer",
						className: "Project",
						objectId: projectId
					},
					created_by: {
						__type: "Pointer",
						className: "_User",
						objectId: user.objectId
					},
					assigned_staff: [],
					archived: false
				},
				afterSaveHandler: () => refetch
			});

			setIsOpen(false);
			refetch();
		},
		[user, projectId, refetch]
	);

	const siteHeaderButtons = [
		{
			text: "Neues Objekt erstellen",
			onClick: () => setIsOpen(true),
			is_add_button: true
		}
	];

	return (
		<Page title="Objektübersicht" pageHeaderButtons={siteHeaderButtons}>
			<Table
				columns={columns}
				data={data || []}
				pagination={pagination}
				setPagination={setPagination}
				rowCount={count}
				filters={filters}
				setFilters={setFilters}
				filterColumns={filterColumns}
				setOrder={setOrder}
			/>
			<CreatePropterty
				objects={data || []}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				createObject={createObjectHandler}
			/>
		</Page>
	);
};

export default PropertyOverview;
