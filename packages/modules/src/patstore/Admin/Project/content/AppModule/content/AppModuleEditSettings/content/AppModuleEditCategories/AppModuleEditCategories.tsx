import { AppModuleEditSettingProps } from "./types";
import AppModuleEditCategory from "./components/AppModuleEditCategory";

const AppModuleEditCategories = ({
	settingKey,
	settings,
	setSettings
}: AppModuleEditSettingProps) => {
	if (!settings || !settingKey) {
		return null;
	}

	if (settingKey === "categories") {
		return (
			<AppModuleEditCategory
				categories={settings.categories}
				setSettings={setSettings}
			/>
		);
	}

	return null;
};

export default AppModuleEditCategories;
