import { Dispatch, SetStateAction, useMemo } from "react";
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
				name: "settings.languages",
				type: "select",
				label: "Sprachen",
				value: settings?.languages,
				select_options: [
					{ label: "Deutsch", value: "de" },
					{ label: "Englisch", value: "en" }
				],
				isMulti: true,
				dataType: "string",
				width: 240
			},
			{
				id: "default_language",
				position: 3,
				name: "settings.default_language",
				type: "select",
				label: "Standardsprache",
				value: settings?.default_language,
				select_options: [
					{ label: "Deutsch", value: "de", disabled: false },
					{
						label: "Englisch",
						value: "en",
						disabled: settings?.languages?.includes("en")
					}
				],
				dataType: "string",
				width: 240
			}
		];
	}, [settings]);

	return (
		<Form
			fields={formFields}
			data={settings}
			formSubmitHandler={(values) => {
				console.log(values);
				Object.keys(values).forEach((key) => {
					setData(key, values[key]);
				});
			}}
			useWithDebounce
		/>
	);
};

export default LanguageSettings;
