import { SwitchButtons } from "@repo/ui";
import { useMemo } from "react";
import { LanguageValue } from "@repo/types";
import { getLanguageSwitchStates } from "../functions/getLanguageSwitchStates";

const LanguageSelector = ({
	language,
	changeLanguage,
	languages = []
}: {
	language?: LanguageValue;
	changeLanguage?: (language: LanguageValue) => void;
	languages?: LanguageValue[];
}) => {
	const languagesSelect = useMemo(
		() => getLanguageSwitchStates(languages),
		[languages]
	);

	if (!language || changeLanguage === undefined || languages?.length < 2) {
		return null;
	}

	return (
		<div>
			<SwitchButtons
				buttonStates={languagesSelect}
				currentStates={languagesSelect.find(
					(lng) => lng.value === language
				)}
				changeHandler={(state) => changeLanguage?.(state.value as LanguageValue)}
			/>
		</div>
	);
};

export default LanguageSelector;
