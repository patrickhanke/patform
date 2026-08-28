import { languages_short } from "@repo/provider";
import { SwitchButtons } from "@repo/ui";
import { useMemo } from "react";
import { Language, LanguageValue } from "@repo/types";

type LanguageSelect = {
	value: LanguageValue;
	label: Language["label"];
	disabled: boolean;
};

const LanguageSelector = ({
	language,
	changeLanguage,
	languages = []
}: {
	language?: LanguageValue;
	changeLanguage?: (language: LanguageValue) => void;
	languages?: LanguageValue[];
}) => {
	const handleLanguageChange = (
		language: (typeof languages_short)[number]
	) => {
		if (changeLanguage) {
			changeLanguage(language.value);
		}
	};

	const languagesSelect = useMemo(() => {
		const languagesArray: LanguageSelect[] = [];
		languages?.forEach((lng) => {
			const findLng = languages_short.find((lang) => lang.value === lng);
			if (findLng) {
				languagesArray.push({
					label: findLng.label,
					value: findLng.value,
					disabled: languages.length === 1
				});
			}
		});
		return languagesArray;
	}, [language, languages]);

	if (!language || changeLanguage === undefined || languages?.length < 2) {
		console.log("returning null");
		return null;
	}

	return (
		<div>
			<SwitchButtons
				buttonStates={languagesSelect}
				currentStates={languagesSelect.find(
					(lng) => lng.value === language
				)}
				changeHandler={handleLanguageChange}
			/>
		</div>
	);
};

export default LanguageSelector;
