import { AppModuleEditSettingProps } from "./types";
import AppModuleEditCategory from "./components/AppModuleEditCategory";

const AppModuleEditCategories = ({
	settingKey,
	settings,
	setData
}: AppModuleEditSettingProps) => {
	if (!settings || !settingKey) {
		return null;
	}

	if (settingKey === "categories") {
		return (
			<AppModuleEditCategory
				categories={settings.categories}
				setData={setData}
			/>
		);
	}

	return null;
};

export default AppModuleEditCategories;
