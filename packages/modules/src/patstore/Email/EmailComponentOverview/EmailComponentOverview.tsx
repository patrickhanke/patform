"use client";

import {
	Page,
	RenderFilters,
	Table,
	useCreateColumns,
	usePageData
} from "@repo/ui";
import { useContext, useMemo, useState } from "react";

import { ContentClass, Filter, ModuleOverviewProps } from "@repo/types";
import { PatstoreAppContext, useFindData } from "@repo/provider";
import createWebpageContenClass from "./constant/createEmailContentClass";

const EmailComponentOverview = ({
	module,
	languages,
	defaultLanguage
}: ModuleOverviewProps<"/emails">) => {
	const { currentModule } = useContext(PatstoreAppContext);
	const [filters, setFilters] = useState<Filter[]>([
		{
			key: "type",
			value: "email",
			operator: "equalTo"
		}
	]);
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
			{ id: "createdAt", type: "date", label: "Erstellt am" }
		],
		fields: [],
		className: "Content",
		refetch,
		categories: [],
		editLink: "emails/templates",
		initialData: data ?? []
	});
	const { data: pageRows } = usePageData<ContentClass[]>();

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
			description="Hier können Komponenten erstellt werden, die in E-Mails verwendet werden können."
			emptyContent={true}
			createClass={{ ...createWebpageContenClass, languages }}
			refetch={refetch}
		>
			<Table
				columns={columns}
				data={pageRows ?? data ?? []}
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

export default EmailComponentOverview;
