import { ModuleSettings } from "@repo/types";
import { SetPageData } from "@repo/ui";
import { ModuleSettingsPageData } from "../../types";

export type AppModuleEditSettingProps = {
	settingKey: keyof ModuleSettings | null;
	settings: ModuleSettings;
	setData: SetPageData<ModuleSettingsPageData>;
};

export type AppModuleEditSettingsCategoriesProps = {
	categories: ModuleSettings["categories"];
	setData: SetPageData<ModuleSettingsPageData>;
};
