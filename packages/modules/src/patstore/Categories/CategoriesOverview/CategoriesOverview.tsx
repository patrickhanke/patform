"use client";

import { useContext, useMemo, useState } from "react";
import {
	generateColumnsFromFields,
	Modal,
	Page,
	Table,
	useCreateColumns,
	usePageData
} from "@repo/ui";
import { CategoryClass, LanguageValue, ModuleOverviewProps } from "@repo/types";
import { PatstoreAppContext, useFindModuleData } from "@repo/provider";
import deleteModalInitialValues from "./constants/deleteModalInitialValues";
import CreateCategory from "./components/CreateCategory";

const CategoriesOverview = ({
	module,
	languages,
	defaultLanguage
}: ModuleOverviewProps<"/categories">) => {
	const { currentModule } = useContext(PatstoreAppContext);
	const pageStates = useMemo(
		() => currentModule.settings?.categories,
		[currentModule]
	);
	const [activeState, setActiveState] = useState(
		pageStates ? pageStates[0] : undefined
	);

	const [language, setLanguage] = useState<LanguageValue>(defaultLanguage);
	const { data: categories, refetch } = useFindModuleData<CategoryClass>({
		module,
		filters: activeState?.value
			? [
					{
						key: "category_id",
						value: activeState.id,
						operator: "equalTo",
						id: activeState.id
					}
				]
			: [],
		limit: 30,
		skip: 0,
		order: "createdAt_DESC",
		fetchTranslations: defaultLanguage && languages.length > 1
	});

	const [deleteModal, setDeleteModal] = useState(deleteModalInitialValues);

	const columns = useCreateColumns<CategoryClass>({
		data: generateColumnsFromFields(module.fields),
		fields: module.data_fields,
		className: "Category",
		refetch,
		categories: module.categories,
		initialData: categories ?? [],
		languages,
		language
	});
	const { data: pageRows } = usePageData<CategoryClass[]>();

	const pageHeaderContent = useMemo(
		() =>
			activeState ? (
				<CreateCategory
					refetch={refetch}
					typeId={activeState?.id}
					typeLabel={activeState?.label}
					type={activeState?.value}
				/>
			) : null,
		[activeState, refetch]
	);

	return (
		<Page
			title={module.name}
			pageHeaderContent={pageHeaderContent}
			pageStates={pageStates}
			pageState={activeState}
			setPageState={setActiveState}
		>
			<Table
				columns={columns}
				data={pageRows ?? categories ?? []}
				language={language}
				changeLanguage={setLanguage}
				languages={languages}
				pagination={{
					pageIndex: 0,
					pageSize: 30
				}}
				rowCount={30}
			/>
			<Modal
				isOpen={deleteModal.isOpen}
				cancelButtonHandler={() =>
					setDeleteModal(deleteModalInitialValues)
				}
				confirmButtonHandler={() => {
					deleteModal.confirmButtonHandler();
					setDeleteModal(deleteModalInitialValues);
				}}
				header={deleteModal.header}
			>
				<p>Sind sich Sicher, dass sie die Person löschen möchten?</p>
			</Modal>
		</Page>
	);
};

export default CategoriesOverview;
