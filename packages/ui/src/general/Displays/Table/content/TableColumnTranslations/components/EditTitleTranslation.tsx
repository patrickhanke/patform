import { FC, useCallback, useMemo, useState } from "react";
import { EditTitleTranslationProps } from "../types";
import { LanguageValue } from "@repo/types";
import { SwitchButtons } from "@repo/ui";
import { languages as languagesArray } from "@repo/provider";

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

	const currentStates = useMemo(() => {
		return languages.map((lang) => ({
			label: languagesArray.find((l) => l.value === lang)
				?.label as string,
			value: lang,
			disabled: false
		}));
	}, [languages]);

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
				changeHandler={(value) => setLangState(value as LanguageValue)}
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
