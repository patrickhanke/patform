import { FC, useCallback, useMemo, useState } from "react";
import { EditTitleTranslationProps } from "../types";
import { LanguageValue } from "@repo/types";
import { isArray } from "lodash";
import { SwitchButtons } from "@repo/ui";
import  {languages as languagesArray} from "@repo/provider" 

const EditTitleTranslation: FC<EditTitleTranslationProps> = ({
	value,
	isLink = false,
	onChange,
	languages = [],	
	defaultLanguage,
}) => {
	const [langState, setLangState] = useState<LanguageValue>(defaultLanguage as LanguageValue)

	const currentStates = useMemo(() => {
		return languages.map((lang) => ({
			label: languagesArray.find((l) => l.value === lang)?.label as string,
			value: lang.code,
			disabled: false
		}));
	}, [languages]);

	const handleInputChange = useCallback((key, string, value: string) => {
		onChange(value);
	}, [onChange]);

	if (isArray(languages) && languages.length > 1) {
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
					onChange={(e) => handleInputChange("title", e.target.value)}
				/>
			</div>
		);
	} else {
		return (isEditable ? (
			<div
				className={"table_column_textfield_textarea_container"}
			>
				<input
					type={isLink ? "url" : "text"}
					defaultValue={value}
					onChange={(e) => handleInputChange("title", e.target.value)}
				/>
			</div>
		) : (
			<p>{value}</p>
		)
	}
};

export default LangEditTitleTranslation;
