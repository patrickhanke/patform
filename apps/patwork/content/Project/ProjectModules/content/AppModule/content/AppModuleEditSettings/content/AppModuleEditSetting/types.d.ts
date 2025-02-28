import { ModuleSettings } from "@repo/types";
import { Updater } from "use-immer";

export type AppModuleEditSettingProps = {
    settingKey: keyof ModuleSettings | null;
    setSettings: Updater<ModuleSettings[key]>;
    settings: ModuleSettings;
}

export type AppModuleEditSettingsCategoriesProps = {
    categories: ModuleSettings['categories'];
    setSettings: Updater<ModuleSettings[key]>;

}

export type AppModuleSettingsCategoryKeyValuePair = {
    [key: ModuleSettings['categories'][number][key]]: string;
}
