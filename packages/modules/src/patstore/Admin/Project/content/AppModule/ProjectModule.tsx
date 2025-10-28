import { generateGraphQLQuery } from "@repo/provider";
import { useQuery } from "@apollo/client";
import { Loader } from "@repo/ui";
import "./styles.scss";
import {
	AppModuleEditCategories,
	AppModuleEditDataFields,
	AppModuleEditFields,
	AppModuleEditSettings
} from "./content";

const AppModule = ({ id, projectId }: { id: string; projectId: string }) => {
	const { data, loading, refetch } = useQuery(
		generateGraphQLQuery({
			type: "get",
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
				"data_fields"
			]
		}),
		{
			variables: { id }
		}
	);

	if (loading) return <Loader width="100%" height="30px" />;

	const module = data?.objects.getModule;

	return (
		<div className="app_module_container">
			<div style={{ width: "300px" }}>
				<h3>{module.name}</h3>
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
		</div>
	);
};

export default AppModule;
