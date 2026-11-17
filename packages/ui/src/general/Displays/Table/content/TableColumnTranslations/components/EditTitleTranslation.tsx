import { FC, useCallback, useMemo, useState } from "react";
import { EditTitleTranslationProps } from "../types";
import { LanguageValue } from "@repo/types";
import { SwitchButtons } from "@repo/ui";
import { getLanguageSwitchStates } from "../../../functions/getLanguageSwitchStates";

const EditTitleTranslation: FC<EditTitleTranslationProps> = ({
	value,
	isLink = false,
	onChange,
	languages = [],
	defaultLanguage
}) => {
	const [langState, setLangState] = useState<LanguageValue>(
		defaultLanguage as LanguageValue
	);

	const currentStates = useMemo(
		() => getLanguageSwitchStates(languages as LanguageValue[]),
		[languages]
	);

	const handleInputChange = useCallback(
		(value: string) => {
			const key = `${langState}.title`;
			console.log(key, value);
		},
		[onChange]
	);

	return (
		<div>
			<SwitchButtons
				buttonStates={currentStates}
				changeHandler={(state) =>
					setLangState(state.value as LanguageValue)
				}
				currentStates={currentStates.find((l) => l.value === langState)}
			/>
			<input
				type={isLink ? "url" : "text"}
				defaultValue={value}
				onChange={(e) => handleInputChange(e.target.value)}
			/>
		</div>
	);
};

export default EditTitleTranslation;
