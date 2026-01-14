import { FormClass } from "@repo/types";
import { set } from 'lodash-es';
import { Dispatch, SetStateAction } from "react";

export type FormEmailProps = {
	formId: string;
};

export type FormEmailSettingsToggleProps = {
	settingsKey: keyof FormClass["settings"];
	loading: boolean;
	settings: FormClass["settings"];
	updateSettings: (key: keyof FormClass["settings"], value: boolean) => void;
};

export type FormEmailSettingsObject = {
	[key: keyof typeof form_settings]: {
		label: string;
		description: string;
		value: boolean | Recipient[];
	};
};

export type FormEmailSettingsTextProps = {
	settingsKey: keyof FormClass["settings"];
	settings: FormClass["settings"];
	updateSettings: (key: keyof FormClass["settings"], value: string) => void;
	isPassword?: boolean;
};

export type FormEmailSettingsNumberProps = {
	settingsKey: keyof FormClass["settings"];
	settings: FormClass["settings"];
	updateSettings: (key: keyof FormClass["settings"], value: number) => void;
};

export type TestEmailProps = {
	testEmail: boolean;
	setTestEmail: Dispatch<SetStateAction<boolean>>;
}
