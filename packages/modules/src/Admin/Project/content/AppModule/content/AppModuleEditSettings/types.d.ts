import { ImmerHook, Updater, useImmer } from 'use-immer';
import { ModuleCategory, ModuleSettings } from "@repo/types";

export type AppModuleEditSettingsProps = {
    initialSettings: ModuleSettings;
    moduleId: string;
    refetch: () => void;
}

export type AppModuleCategoryProps = {
    category: ModuleCategory;
    setActiveCategory: (C: string) => void;
}

export type AppModuleEditSettingProps = {
    settings?: ModuleSettings;
    setSettings: Updater<ModuleSettings>;
}