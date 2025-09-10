import { Updater } from "use-immer";
import { ModuleCategory, ModuleSettings } from "@repo/types";

export type AppModuleEditSettingsProps = {
	initialSettings: ModuleSettings;
	moduleId: string;
	refetch: () => void;
	modulePath: string;
};

export type AppModuleCategoryProps = {
	category: ModuleCategory;
	setActiveCategory: (C: string) => void;
};

export type AppModuleEditSettingProps = {
	settings?: ModuleSettings;
	setSettings: Updater<ModuleSettings>;
};
