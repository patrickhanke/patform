import { AppModuleSettingsCategoriesProps } from "../types";

const AppModuleSettingsCategories = ({
	setting,
	setActiveSetting
}: AppModuleSettingsCategoriesProps) => {
	return (
		<div>
			<button
				className="full_button sm secondary"
				onClick={() => setActiveSetting(setting)}
			>
				Kategorien
			</button>
		</div>
	);
};

export default AppModuleSettingsCategories;
