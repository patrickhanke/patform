"use client";

import { useDataHandler, useFindData } from "@repo/provider";
import React, { useCallback, useContext } from "react";
import useTableColumns from "./hooks/useTableColumns";
import CreatePropterty from "./components/CreateProperty";
import initialData from "./constants/initialData";
import { Property } from "@repo/types";
import { Page, Table } from "@repo/ui";
import { UserContext } from "@repo/provider";

const PropertyOverview = () => {
	const [isOpen, setIsOpen] = React.useState(false);
	const { user, projectId } = useContext(UserContext);

	const { data, refetch } = useFindData({
		objectName: "Property",
		fields: [
			"objectId",
			"name",
			"createdAt",
			"created_by {objectId username}",
			"archived"
		],
		projectId,
		filters: [
			{ key: "archived", value: true, operator: "_ne" }
		]
	});

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
		[user, projectId]
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
			<div className="content_element no_padding">
				<Table
					columns={columns}
					data={data || []}
				/>
			</div>
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
