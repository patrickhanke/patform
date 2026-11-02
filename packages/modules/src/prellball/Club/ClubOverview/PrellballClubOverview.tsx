"use client";

import { useState } from "react";
import {
	generateColumnsFromFields,
	Page,
	Table,
	useCreateColumns
} from "@repo/ui";
import {
	Filter,
	LanguageValue,
	ModuleOverviewProps,
	PrellballClubClass
} from "@repo/types";
import { useFindModuleData } from "@repo/provider";
import { clubCreateFields, clubInitialData } from "./constants/create_fields";

const PrellballClubOverview = ({
	module,
	languages,
	defaultLanguage
}: ModuleOverviewProps<"/vereine">) => {
	const [filters, setFilters] = useState<Filter[]>([]);
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
	} = useFindModuleData<PrellballClubClass>({
		module,
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize,
		order,
		fetchTranslations: Boolean(defaultLanguage) && languages.length > 1,
		additionalFields: ["title", "settings"]
	});

	console.log(data);

	const columns = useCreateColumns<PrellballClubClass>({
		data: generateColumnsFromFields(module.fields),
		fields: module.data_fields,
		className: "Club",
		refetch,
		categories: module.categories ?? [],
		initialData: data ?? [],
		languages: languages,
		language: language,
		editLink: "vereine"
	});

	return (
		<Page
			title={module.name}
			emptyContent
			createClass={{
				className: "Club",
				text: "Neuen Verein erstellen",
				fields: clubCreateFields,
				refetch,
				languages,
				initialData: clubInitialData
			}}
			refetch={refetch}
		>
			<Table
				columns={columns}
				data={data || []}
				loading={dataLoading}
				rowCount={count}
				pagination={pagination}
				setPagination={setPagination}
				setOrder={setOrder}
				language={language}
				changeLanguage={setLanguage}
				languages={languages}
				filters={filters}
				filterColumns={module.filters || []}
				setFilters={setFilters}
			/>
		</Page>
	);
};

export default PrellballClubOverview;
