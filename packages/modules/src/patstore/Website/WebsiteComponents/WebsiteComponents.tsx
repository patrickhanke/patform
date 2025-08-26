"use client";

import {
	Page,
	PageHeaderButton,
	RenderFilters,
	Table,
	useCreateColumns
} from "@repo/ui";
import { useContext, useMemo, useState } from "react";

import { ContentClass, Filter } from "@repo/types";
import { PatstoreAppContext } from "@repo/provider";
import useFindContent from "./hooks/useFindContent";
import CreateContent from "./components/CreateContent";

const WebsiteComponents = () => {
	const { currentModule, user } = useContext(PatstoreAppContext);
	const [addContent, setAddContent] = useState(false);
	const [filters, setFilters] = useState<Filter[]>([
		{
			id: "type",
			key: "type",
			operator: "_in",
			value: ["table", "faq"]
		}
	]);

	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	});

	const { content, refetch, count } = useFindContent({
		moduleId: currentModule.objectId,
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize
	});

	const pageHeaderButtons: PageHeaderButton[] = useMemo(
		() => [
			{
				text: "Komponente hinzufügen",
				onClick: () => {
					setAddContent(true);
				},
				icon: "add",
				is_add_button: true,
				disabled: !user?.is_superuser
			}
		],
		[user]
	);

	console.log(user);

	const columns = useCreateColumns<ContentClass>({
		data: [
			{ id: "name", type: "edit_string", label: "Name" },
			{
				id: "content_id",
				type: user.is_superuser ? "edit_string" : "string",
				label: "ID (kann nicht geändert werden)"
			},
			{ id: "type", type: "string", label: "Typ" },
			{ id: "createdAt", type: "date", label: "Erstellt am" },
			{ id: "active", type: "boolean", label: "Aktiv" },
			{
				id: "content",
				type: "edit_webpage_components",
				label: "Inhalt bearbeiten"
			}
		],
		fields: [],
		className: "Content",
		refetch,
		categories: []
	});

	const renderFilters = useMemo(() => {
		return (
			<RenderFilters
				filters={filters}
				setFilters={setFilters}
				fields={[
					{
						type: "input",
						key: "name",
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
			pageHeaderButtons={user?.is_superuser ? pageHeaderButtons : []}
		>
			<Table
				columns={columns}
				data={content || []}
				setPagination={setPagination}
				pagination={pagination}
				rowCount={count}
				filterContent={renderFilters}
			/>
			<CreateContent
				createContent={addContent}
				setCreateContent={setAddContent}
				allContent={content || []}
				refetch={refetch}
			/>
		</Page>
	);
};

export default WebsiteComponents;
