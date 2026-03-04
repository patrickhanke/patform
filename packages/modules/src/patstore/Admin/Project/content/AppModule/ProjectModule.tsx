import { useGetData } from "@repo/provider";
import { Loader } from "@repo/ui";
import "./styles.scss";
import {
	AppModuleEditCategories,
	AppModuleEditDataFields,
	AppModuleEditFields,
	AppModuleEditFilters,
	AppModuleEditSettingFields,
	AppModuleEditSettings
} from "./content";
import { Module } from "@repo/types";
import { useMemo } from "react";
import { AdditionalField } from "./types";

const AppModule = ({
	id,
	projectId,
	modules
}: {
	id: string;
	projectId: string;
	modules: Module[];
}) => {
	const { data, loading, refetch } = useGetData({
		objectName: "Module",
		fields: [
			"objectId",
			"name",
			"createdAt",
			"icon",
			"path",
			"settings",
			"fields",
			"name",
			"position",
			"categories",
			"connected_class",
			"data_fields",
			"setting_fields",
			"filters"
		],
		id
	});

	const additionnalFields = useMemo(() => {
		const additionalFieldsArray: AdditionalField[] = [];
		const hasEmailModule = modules.find(
			(module) => module.path === "/emails"
		);
		if (!data) return additionalFieldsArray;

		if (hasEmailModule && data.path === "/users") {
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
				type: "input"
			});
		}

		return additionalFieldsArray;
	}, [data]);

	if (loading) return <Loader width="100%" height="30px" />;

	const module = data;

	console.log("module", module);
	if (!module) return null;

	return (
		<div className="app_module_container">
			<div style={{ width: "300px" }}>
				<h3>{module?.name}</h3>
			</div>
			{module.settings && (
				<AppModuleEditSettings
					moduleId={id}
					initialSettings={module.settings}
					refetch={refetch}
					modulePath={module.path}
				/>
			)}
			<AppModuleEditCategories
				moduleId={id}
				initialCategories={module.categories}
				projectId={projectId}
				moduleName={module.name}
			/>
			<AppModuleEditFields
				moduleId={id}
				modulePath={module.path}
				initialFields={module.fields}
				refetch={refetch}
				moduleName={module.name}
			/>
			<AppModuleEditDataFields
				moduleId={id}
				initialFields={module.data_fields}
			/>
			<AppModuleEditSettingFields
				moduleId={id}
				initialFields={module.setting_fields}
			/>
			<AppModuleEditFilters
				moduleId={id}
				moduleName={module.name}
				initialFilters={module.filters}
				modulePath={module.path}
				modules={modules.map((module) => ({
					value: module.objectId,
					connected_class: module.connected_class,
					label: module.name
				}))}
				settingsFields={module.setting_fields}
				dataFields={module.data_fields}
				additionnalFields={additionnalFields}
			/>
		</div>
	);
};

export default AppModule;
