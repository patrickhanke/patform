import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { EditTranslationFieldProps } from "../types";
import { ClassTranslation, LanguageValue } from "@repo/types";
import { IconButton, Modal, SwitchButtons } from "@repo/ui";
import { languages as languagesArray } from "@repo/provider";
import { cloneDeep, get, set } from "lodash-es";

const TableColumnEditTextfieldTranslation: FC<EditTranslationFieldProps> = ({
	value,
	columnKey,
	isEditable = false,
	onChange,
	languages = [],
	language
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [langState, setLangState] = useState<LanguageValue>(
		language as LanguageValue
	);
	const [newTranslation, setNewTranslation] =
		useState<ClassTranslation>(value);

	const currentStates = useMemo(() => {
		return languages.map((lang) => ({
			label: languagesArray.find((l) => l.value === lang)
				?.label as string,
			value: lang,
			disabled: false
		}));
	}, [languages]);

	useEffect(() => {
		if (!isOpen) {
			setLangState(language as LanguageValue);
			setNewTranslation(value);
		}
	}, [language, value, isOpen]);

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			const newTranslationCopy = cloneDeep(newTranslation);
			set(
				newTranslationCopy,
				`${langState}.${columnKey}`,
				e.target.value
			);
			setNewTranslation(newTranslationCopy);
		},
		[newTranslation, langState, columnKey]
	);

	const renderValue = useMemo(() => {
		return get(value, `${language}.${columnKey}`) || "";
	}, [value, language, columnKey]);

	return (
		<div>
			<div className="table_column_textfield_container">
				{renderValue ? (
					<span>
						{renderValue.length > 60
							? `${renderValue.slice(0, 60)}...`
							: renderValue}
					</span>
				) : (
					"-"
				)}

				{isEditable && (
					<IconButton icon="edit" onClick={() => setIsOpen(!isOpen)} />
				)}
			</div>
			<Modal
				isOpen={isOpen}
				cancelButtonHandler={() => setIsOpen(false)}
				confirmButtonHandler={() => {
					onChange("translations", newTranslation);
					setIsOpen(false);
				}}
				header={"Beschreibung ändern"}
				buttonDisabled={[false, false]}
			>
				<SwitchButtons
					buttonStates={currentStates}
					changeHandler={(state) =>
						setLangState(state.value as LanguageValue)
					}
					currentStates={currentStates.find(
						(l) => l.value === langState
					)}
				/>
				{currentStates.map((lang) => {
					return (
						langState === lang.value && (
							<textarea
								key={lang.value}
								defaultValue={
									get(
										newTranslation,
										`${langState}.${columnKey}`
									) || ""
								}
								onChange={handleInputChange}
							/>
						)
					);
				})}
			</Modal>
		</div>
	);
};

export default TableColumnEditTextfieldTranslation;
