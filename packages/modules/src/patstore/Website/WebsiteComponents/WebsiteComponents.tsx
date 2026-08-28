"use client";

import { Page, RenderFilters, Table, useCreateColumns } from "@repo/ui";
import { useContext, useMemo, useState } from "react";

import { ContentClass, Filter, ModuleOverviewProps } from "@repo/types";
import { PatstoreAppContext, useFindData } from "@repo/provider";
import createWebpageContenClass from "./constant/createWebpageContentClass";

const WebsiteComponents = ({
	module,
	languages,
	defaultLanguage
}: ModuleOverviewProps<"/website">) => {
	const { currentModule, user } = useContext(PatstoreAppContext);
	const [filters, setFilters] = useState<Filter[]>([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	});

	const { loading, data, refetch, count, language, changeLanguage } =
		useFindData({
			objectName: "Content",
			fields: [
				"objectId",
				"title",
				"content_id",
				"type",
				"createdAt",
				"active",
				"data",
				"created_by {objectId username}",
				"updated_by {objectId username}",
				"categories"
			],
			moduleId: module.objectId,
			filters: filters,
			skip: pagination.pageIndex * pagination.pageSize,
			limit: pagination.pageSize,
			defaultLanguage
		});

	const columns = useCreateColumns<ContentClass>({
		data: [
			{ id: "title", type: "string", label: "Name" },
			{
				id: "content_id",
				type: user.is_superuser ? "edit_string" : "string",
				label: "ID (kann nicht geändert werden)"
			},
			{ id: "type", type: "string", label: "Typ" },
			{ id: "createdAt", type: "date", label: "Erstellt am" },
			{ id: "active", type: "boolean", label: "Aktiv" }
		],
		fields: [],
		className: "Content",
		refetch,
		categories: [],
		editLink: "website/components"
	});

	const renderFilters = useMemo(() => {
		return (
			<RenderFilters
				filters={filters}
				setFilters={setFilters}
				fields={[
					{
						type: "input",
						key: "title",
						operator: "_regex",
						value: "",
						placeholder: "Suchwort"
					}
				]}
				categories={[]}
				initialFilters={filters}
			/>
		);
	}, []);

	return (
		<Page
			title={`${currentModule.name} - Komponenten`}
			description="Hier können Komponenten erstellt werden, die auf den Seiten eingebunden werden können."
			emptyContent={true}
			createClass={{ ...createWebpageContenClass, languages }}
			refetch={refetch}
		>
			<Table
				columns={columns}
				data={data || []}
				setPagination={setPagination}
				pagination={pagination}
				rowCount={count}
				filterContent={renderFilters}
				loading={loading}
				language={language}
				changeLanguage={changeLanguage}
				languages={languages}
			/>
		</Page>
	);
};

export default WebsiteComponents;
