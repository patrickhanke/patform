import { useMemo } from "react";
import { Form, SetPageData } from "@repo/ui";
import { ModuleSettings } from "@repo/types";
import { toLocaleKey } from "@repo/provider";

const LanguageSettings = ({
	setData,
	settings
}: {
	setData: SetPageData<ModuleSettings>;
	settings: ModuleSettings;
}) => {
	const formFields = useMemo(() => {
		return [
			{
				id: "languages",
				position: 3,
				name: "languages",
				type: "select",
				label: "Sprachen",
				value: settings?.languages?.map((lang) => toLocaleKey(lang)),
				select_options: [
					{ label: "Deutsch", value: "de-DE" },
					{ label: "Englisch", value: "en-GB" }
				],
				isMulti: true,
				dataType: "string",
				width: 240
			},
			{
				id: "default_language",
				position: 3,
				name: "default_language",
				type: "select",
				label: "Standardsprache",
				value: settings?.default_language
					? toLocaleKey(settings.default_language)
					: settings?.default_language,
				select_options: [
					{ label: "Deutsch", value: "de-DE", disabled: false },
					{
						label: "Englisch",
						value: "en-GB",
						disabled: !settings?.languages?.some(
							(lang) => toLocaleKey(lang) === "en-GB"
						)
					}
				],
				dataType: "string",
				width: 240
			},
			{
				id: "description",
				position: 3,
				name: "description",
				type: "textarea",
				label: "Beschreibung",
				value: settings?.description,
				width: 240,
				disabled: !settings.languages || settings?.languages?.length > 2
			}
		];
	}, [settings, settings?.languages?.length]);

	return (
		<Form
			fields={formFields}
			data={settings}
			formSubmitHandler={(values) => {
				Object.keys(values).forEach((key) => {
					setData(`settings.${key}`, values[key] as string);
				});
			}}
			useWithDebounce
			enableReinitialize
		/>
	);
};

export default LanguageSettings;
