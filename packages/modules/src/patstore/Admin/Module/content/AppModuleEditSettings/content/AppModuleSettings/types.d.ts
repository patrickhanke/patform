import { ModuleSettings } from "@repo/types";

export type AppModuleSettingsProps = {
  settings: ModuleSettings;
  setActiveSetting: (settings: ModuleSettings[key]) => void;
};

export type AppModuleSettingsCategoriesProps = {
  setting: keyof ModuleSettings;
  setActiveSetting: AppModuleSettingsProps["setActiveSetting"];
};
