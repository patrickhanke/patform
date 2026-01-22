import { EmailClass } from "@repo/types";

export type EmailSettingsToggleProps = {
	settingsKey: keyof EmailClass["settings"];
	loading: boolean;
	settings: EmailClass["settings"];
	updateSettings: (settings: EmailClass["settings"]) => Promise<void>;
};

export type EmailSettingsInputProps = {
	settingsKey: keyof EmailClass["settings"];
	loading: boolean;
	settings: EmailClass["settings"];
	updateSettings: (settings: EmailClass["settings"]) => Promise<void>;
	disabled?: boolean;
};
