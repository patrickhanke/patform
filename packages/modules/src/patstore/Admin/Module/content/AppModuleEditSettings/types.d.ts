import { ModuleSettings } from "@repo/types";
import { SetPageData, type PageDataUpdateOptions } from "@repo/ui";

export type ModuleSettingsPageData = {
	settings: ModuleSettings;
};

export type AppModuleEditSettingsProps = {
	objectId: string;
	initialSettings: ModuleSettings;
	modulePath: string;
	updateOptions: PageDataUpdateOptions<ModuleSettingsPageData>;
};

export type AppModuleEditSettingProps = {
	settingKey: keyof ModuleSettings | null;
	settings: ModuleSettings;
	setData: SetPageData<ModuleSettingsPageData>;
};
