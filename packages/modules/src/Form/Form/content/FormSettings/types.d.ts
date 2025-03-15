import { FormClass, Recipient } from "@repo/types";
import form_settings from "./constants/form_settings";

export type FormSettingsToggleProps = {
  settingsKey: keyof FormClass["settings"];
  loading: boolean;
  settings: FormClass["settings"];
  updateSettings: (T: FormClass["settings"]) => void;
};

export type FormSettingsObject = {
  [key: keyof typeof form_settings]: {
    label: string;
    description: string;
    value: boolean | Recipient[];
  };
};

export type FormSettingsTextProps = {
  settings: FormClass["settings"];
  updateSettings: (T: FormClass["settings"]) => void;
};
