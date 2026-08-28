import { ModuleSettings } from "@repo/types";
import { SetPageData, type PageDataUpdateOptions } from "@repo/ui";

export type AppModuleEditSettingsProps = {
	objectId: string;
	initialSettings: ModuleSettings;
	modulePath: string;
	updateOptions: PageDataUpdateOptions<{ settings: ModuleSettings }>;
};

export type AppModuleEditSettingProps = {
	settingKey: keyof ModuleSettings | null;
	settings: ModuleSettings;
	setData: SetPageData<ModuleSettingsPageData>;
};
