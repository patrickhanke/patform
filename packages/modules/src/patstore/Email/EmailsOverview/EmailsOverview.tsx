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
	EmailTemplate,
	Filter,
	LanguageValue,
	ModuleOverviewProps
} from "@repo/types";
import { useFindModuleData } from "@repo/provider";

const EmailsOverview = ({
	module,
	languages,
	defaultLanguage
}: ModuleOverviewProps<"/emails">) => {
	const [filters] = useState<Filter[]>([
		{
			key: "type",
			operator: "equalTo",
			value: "template"
		}
	]);
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
	} = useFindModuleData<EmailTemplate>({
		module,
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize,
		order,
		fetchTranslations: defaultLanguage && languages.length > 1
	});

	const columns = useCreateColumns<EmailTemplate>({
		data: generateColumnsFromFields(module.fields),
		fields: module.data_fields,
		className: "Email",
		editLink: "emails",
		refetch,
		categories: module.categories,
		initialData: data ?? [],
		languages,
		language
	});
	const { data: pageRows } = usePageData<EmailTemplate[]>();

	return (
		<Page
			title={module.name}
			emptyContent={true}
			createClass={{
				className: "Email",
				text: "Neue E-Mail erstellen",
				fields: module.fields,
				refetch: refetch,
				languages,
				initialState: "draft",
				initialData: {
					type: "template",
					state: "draft",
					settings: {
						recipient_list: "",
						subject: ""
					}
				}
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

export default EmailsOverview;
