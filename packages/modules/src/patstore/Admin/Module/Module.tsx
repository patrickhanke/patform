"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Field, ModuleSettings, Module as ModuleType, PageState } from "@repo/types";
import { Loader, Page, type PageDataUpdateOptions } from "@repo/ui";
import { useFindData, useGetData } from "@repo/provider";
import page_states from "./constants/page_states";
import {
	AppModuleEditCategories,
	AppModuleEditFields,
	AppModuleEditDataFields,
	AppModuleEditSettings,
	AppModuleEditFilters
} from "./content";
import { AdditionalField } from "./types";
import { ModuleCategoriesPageData } from "./content/AppModuleEditCategories/types";
import { ModuleFieldsPageData } from "./content/AppModuleEditFields/types";
import { ModuleDataFieldsPageData } from "./content/AppModuleEditDataFields/types";
import { ModuleFiltersPageData } from "./content/AppModuleEditFilters/types";

const categoriesUpdateOptions: PageDataUpdateOptions<ModuleCategoriesPageData> =
	{
		className: "Module",
		updateObject: (data) => ({
			categories: data.categories
		}),
		message: "Kategorien gespeichert"
	};

const fieldsUpdateOptions: PageDataUpdateOptions<ModuleFieldsPageData> = {
	className: "Module",
	updateObject: (data) => ({
		fields: data.fields
	}),
	message: "Felder gespeichert"
};

const dataFieldsUpdateOptions: PageDataUpdateOptions<ModuleDataFieldsPageData> =
	{
		className: "Module",
		updateObject: (data) => ({
			data_fields: data.data_fields
		}),
		message: "Datenfelder gespeichert"
	};

const settingsUpdateOptions: PageDataUpdateOptions<{
	settings: ModuleSettings;
}> = {
	className: "Module",
	updateObject: (data) => ({
		settings: data.settings
	}),
	message: "Einstellungen gespeichert"
};

const filtersUpdateOptions: PageDataUpdateOptions<ModuleFiltersPageData> = {
	className: "Module",
	updateObject: (data) => ({
		filters: data.filters
	}),
	message: "Filter gespeichert"
};

const Module = () => {
	const { module_id: moduleId, project_id: projectId } = useParams<{
		module_id: string;
		project_id: string;
	}>();
	const [pageState, setPageState] = useState<PageState>(
		page_states[0] as PageState
	);

	const { data, refetch, loading } = useGetData({
		objectName: "Module",
		fields: [
			"objectId",
			"name",
			"createdAt",
			"icon",
			"path",
			"settings",
			"fields",
			"position",
			"categories",
			"connected_class",
			"data_fields",
			"setting_fields",
			"filters"
		],
		id: moduleId
	});

	const { data: modules } = useFindData({
		objectName: "Module",
		fields: ["objectId", "name", "connected_class", "path"],
		projectId
	});

	const module = data as ModuleType | null;

	const additionalFields = useMemo(() => {
		const additionalFieldsArray: AdditionalField[] = [];
		const hasEmailModule = (modules as ModuleType[] | undefined)?.find(
			(item) => item.path === "/emails"
		);
		if (!module) return additionalFieldsArray;

		if (hasEmailModule && module.path === "/users") {
			additionalFieldsArray.push({
				value: "email",
				label: "E-Mail",
				search_path: "email",
				type: "input"
			});
			additionalFieldsArray.push({
				value: "lists",
				label: "Listen",
				search_path: "lists",
				type: "select"
			});
			additionalFieldsArray.push({
				value: "suppression",
				label: "Unterdrückung",
				search_path: "suppression.suppressed",
				type: "toggle"
			});
		}

		return additionalFieldsArray;
	}, [module, modules]);

	if (loading) return <Loader width="100%" height="100%" />;

	return (
		<Page
			title={module?.name || "Modul"}
			description="Bearbeitung des Moduls"
			pageHeaderButtons={[]}
			pageStates={[...page_states]}
			pageState={pageState}
			setPageState={setPageState}
			refetch={refetch}
		>
			{!module ? (
				<p>Daten konnten nicht geladen werden.</p>
			) : (
				<>
					{pageState.value === "categories" && (
						<AppModuleEditCategories
							objectId={module.objectId}
							initialCategories={module.categories || []}
							projectId={projectId}
							updateOptions={categoriesUpdateOptions}
							refetch={refetch}
						/>
					)}
					{pageState.value === "fields" && (
						<AppModuleEditFields
							objectId={module.objectId}
							initialFields={module.fields || []}
							modulePath={module.path}
							updateOptions={fieldsUpdateOptions}
						/>
					)}
					{pageState.value === "data_fields" && (
						<AppModuleEditDataFields
							objectId={module.objectId}
							initialFields={
								(module.data_fields || []) as Field[]
							}
							updateOptions={dataFieldsUpdateOptions}
							refetch={refetch}
						/>
					)}
					{pageState.value === "settings" && (
						<AppModuleEditSettings
							objectId={module.objectId}
							initialSettings={module.settings || {}}
							modulePath={module.path}
							updateOptions={settingsUpdateOptions}
						/>
					)}
					{pageState.value === "filters" && (
						<AppModuleEditFilters
							objectId={module.objectId}
							initialFilters={module.filters || []}
							modulePath={module.path}
							modules={((modules as ModuleType[]) || []).map(
								(item) => ({
									value: item.objectId,
									connected_class: item.connected_class,
									label: item.name
								})
							)}
							settingsFields={
								(module.setting_fields || []) as Field[]
							}
							dataFields={(module.data_fields || []) as Field[]}
							additionnalFields={additionalFields}
							updateOptions={filtersUpdateOptions}
							refetch={refetch}
						/>
					)}
				</>
			)}
		</Page>
	);
};

export default Module;
