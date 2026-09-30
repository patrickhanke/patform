"use client";

import {
	generateColumnsFromFields,
	Page,
	Table,
	useCreateColumns,
	usePageData
} from "@repo/ui";
import { useState } from "react";
import {
	Filter,
	FormClass,
	LanguageValue,
	ModuleOverviewProps
} from "@repo/types";
import { useFindModuleData } from "@repo/provider";
import initial_data from "./constants/initial_data";

const FormsOverview = ({
	module,
	languages,
	defaultLanguage
}: ModuleOverviewProps<"/forms">) => {
	const [filters] = useState<Filter[]>([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	});
	const [order, setOrder] = useState<string>("createdAt_DESC");
	const [language, setLanguage] = useState<LanguageValue>(defaultLanguage);
	const {
		data,
		refetch,
		count,
		loading: dataLoading
	} = useFindModuleData<FormClass>({
		module,
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize,
		order,
		fetchTranslations: defaultLanguage && languages.length > 1
	});

	const columns = useCreateColumns<FormClass>({
		data: generateColumnsFromFields(module.fields),
		fields: module.data_fields,
		className: "Form",
		editLink: "forms",
		refetch,
		categories: module.categories,
		initialData: data ?? [],
		languages,
		language
	});
	const { data: pageRows } = usePageData<FormClass[]>();

	return (
		<Page
			title={module.name}
			emptyContent={true}
			createClass={{
				className: "Form",
				text: "Neues Formular erstellen",
				fields: module.fields,
				refetch: refetch,
				languages: languages,
				initialState: "draft",
				initialData: initial_data
			}}
			refetch={refetch}
		>
			<Table
				columns={columns}
				data={pageRows ?? data ?? []}
				loading={dataLoading}
				rowCount={count}
				pagination={pagination}
				setPagination={setPagination}
				setOrder={setOrder}
				language={language}
				changeLanguage={setLanguage}
				languages={languages}
			/>
		</Page>
	);
};

export default FormsOverview;
