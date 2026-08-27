"use client";

import { usePageData } from "@repo/ui";
import { AppModuleEditSettingsProps, ModuleSettingsPageData } from "./types";
import { AppModuleEditCategories } from "./content";

const AppModuleEditSettings = ({
	objectId,
	initialSettings,
	modulePath,
	updateOptions
}: AppModuleEditSettingsProps) => {
	const { data, setData } = usePageData<ModuleSettingsPageData>(
		{ initialData: { settings: initialSettings || {} }, objectId },
		updateOptions
	);

	if (modulePath !== "/categories") {
		return (
			<p>Einstellungen sind nur für das Kategorien-Modul verfügbar.</p>
		);
	}

	if (!data) return null;

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
