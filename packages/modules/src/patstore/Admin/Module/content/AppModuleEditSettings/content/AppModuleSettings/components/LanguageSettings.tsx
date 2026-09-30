import { useMemo } from "react";
import { Form, SetPageData } from "@repo/ui";
import { ModuleSettings } from "@repo/types";

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
				value: settings?.languages,
				select_options: [
					{ label: "Deutsch", value: "de-DE" },
					{ label: "Englisch", value: "en-EN" }
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
				value: settings?.default_language,
				select_options: [
					{ label: "Deutsch", value: "de-DE", disabled: false },
					{
						label: "Englisch",
						value: "en-EN",
						disabled: !settings?.languages?.includes("en-EN")
					}
				],
				dataType: "string",
				width: 240
			},
			{
				id: "edit_title",
				position: 3,
				name: "edit_title",
				type: "checkbox",
				label: "Titel bearbeiten",
				value: settings?.edit_title,
				width: 240,
				disabled: !settings.languages || settings?.languages?.length > 2
			},
			{
				id: "edit_text",
				position: 3,
				name: "edit_text",
				type: "checkbox",
				label: "Text bearbeiten",
				value: settings?.edit_text,
				width: 240,
				disabled: !settings.languages || settings?.languages?.length > 2
			},
			{
				id: "edit_description",
				position: 3,
				name: "edit_description",
				type: "checkbox",
				label: "Beschreibung bearbeiten",
				value: settings?.edit_description,
				width: 240,
				disabled: !settings.languages || settings?.languages?.length > 2
			}
		];
	}, [settings, settings.languages.length]);

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
