import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { EditTranslationFieldProps } from "../types";
import { ClassTranslation, LanguageValue } from "@repo/types";
import { Editor, Modal, SwitchButtons } from "@repo/ui";
import { languages as languagesArray } from "@repo/provider";
import { cloneDeep, get, set } from "lodash-es";
import { convert } from "html-to-text";

const TableColumnEditTexteditorTranslation: FC<EditTranslationFieldProps> = ({
	value,
	columnKey,
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

	const handleEditorChange = useCallback(
		(nextValue: string) => {
			const newTranslationCopy = cloneDeep(newTranslation);
			set(newTranslationCopy, `${langState}.${columnKey}`, nextValue);
			setNewTranslation(newTranslationCopy);
		},
		[newTranslation, langState, columnKey]
	);

	const renderValue = useMemo(() => {
		return get(value, `${language}.${columnKey}`) || "";
	}, [value, language, columnKey]);

	const wordCount = useMemo(() => {
		if (!renderValue || renderValue.length === 0) {
			return null;
		}
		return convert(renderValue).trim().split(/\s+/).length;
	}, [renderValue]);

	return (
		<div>
			<div className="table_column_textfield_container">
				<button
					className="full_button sm light"
					type="button"
					onClick={() => setIsOpen(!isOpen)}
				>
					{wordCount ?? "-"} Wörter
				</button>
			</div>
			<Modal
				isOpen={isOpen}
				cancelButtonHandler={() => setIsOpen(false)}
				confirmButtonHandler={() => {
					onChange("translations", newTranslation);
					setIsOpen(false);
				}}
				header={"Text"}
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
							<div
								key={lang.value}
								className="table_column_textfield_textarea_container"
							>
								<Editor
									key={langState}
									content={
										get(
											newTranslation,
											`${langState}.${columnKey}`
										) || ""
									}
									onChange={handleEditorChange}
								/>
							</div>
						)
					);
				})}
			</Modal>
		</div>
	);
};

export default TableColumnEditTexteditorTranslation;
