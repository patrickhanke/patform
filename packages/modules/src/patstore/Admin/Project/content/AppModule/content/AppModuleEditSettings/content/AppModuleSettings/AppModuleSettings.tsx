import AppModuleSettingsCategories from "./components/AppModuleSettingsCategories";
import "./styles.scss";
import { AppModuleSettingsProps } from "./types";

const AppModuleField = ({
	settings,
	setActiveSetting
}: AppModuleSettingsProps) => {
	if (!settings) return null;

	return (
		Object.keys(settings).length > 0 &&
		Object.keys(settings).map((settingKey: string) => {
			if (settingKey === "categories") {
				console.log("categories", settings[settingKey]);
				return (
					<AppModuleSettingsCategories
						setting={settingKey}
						setActiveSetting={setActiveSetting}
					/>
				);
			}

			return null;
		})
	);
};

export default AppModuleField;
