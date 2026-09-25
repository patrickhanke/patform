"use client";

import { usePageData } from "@repo/ui";
import { AppModuleEditSettingsProps } from "./types";
import { AppModuleEditCategories, AppModuleSettings } from "./content";
import { ModuleSettings } from "@repo/types";

const AppModuleEditSettings = ({
	objectId,
	initialSettings,
	modulePath,
	updateOptions
}: AppModuleEditSettingsProps) => {
	const { data, setData } = usePageData<{ settings: ModuleSettings }>(
		{ initialData: { settings: initialSettings || {} }, objectId },
		updateOptions
	);

	if (!data) return null;

	if (modulePath !== "/categories") {
		return <AppModuleSettings setData={setData} settings={data.settings} />;
	}

	return (
		<div className="content_element">
			<AppModuleEditCategories
				settingKey="categories"
				setData={setData}
				settings={data.settings}
			/>
		</div>
	);
};

export default AppModuleEditSettings;
