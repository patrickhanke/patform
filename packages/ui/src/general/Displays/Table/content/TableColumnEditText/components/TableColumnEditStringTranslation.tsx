import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { EditStringTranslationProps } from "../types";
import { ClassTranslation, ErrorMessage, LanguageValue } from "@repo/types";
import { IconButton, Modal, SwitchButtons } from "@repo/ui";
import { languages as languagesArray } from "@repo/provider";
import { cloneDeep, get, set } from "lodash-es";

const EditStringTranslation: FC<EditStringTranslationProps> = ({
	value,
	columnKey,
	isLink = false,
	isEditable = false,
	onChange,
	languages = [],
	language
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isOpenView, setIsOpenView] = useState(false);
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

	const [errors, setErrors] = useState<ErrorMessage[]>([]);

	useEffect(() => {
		if (!isOpen) {
			setLangState(language as LanguageValue);
			setNewTranslation(value);
		}
	}, [language, value, isOpen]);

	const validateUrl = (url: string): boolean => {
		if (!url || url.trim() === "") {
			return true; // Empty is valid (optional field)
		}

		try {
			new URL(url);
			return true;
		} catch {
			return false;
		}
	};

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = e.target.value;

			if (isLink) {
				if (!validateUrl(newValue)) {
					setErrors([
						{
							id: "url-validation-error",
							key: "url",
							message:
								"Bitte geben Sie eine gültige URL ein (z.B. https://example.com)"
						}
					]);
				} else {
					setErrors([]);
				}
			}

			const newTranslationCopy = cloneDeep(newTranslation);
			set(newTranslationCopy, `${langState}.${columnKey}`, newValue);
			setNewTranslation(newTranslationCopy);
		},
		[newTranslation, langState, columnKey]
	);

	const renderValue = useMemo(() => {
		return get(value, `${language}.${columnKey}`) || "";
	}, [value, language, columnKey]);

	const modalCloseHandler = useCallback(() => {
		setIsOpen(false);
		setIsOpenView(false);
	}, []);

	return (
		<div>
			<div className="table_column_textfield_container">
				{renderValue
					? renderValue.length > 30
						? renderValue.slice(0, 30) + "..."
						: renderValue
					: "-"}
				{renderValue && renderValue.length > 30 && (
					<IconButton
						icon="eye"
						onClick={() => setIsOpenView(!isOpenView)}
					/>
				)}

				{isEditable && (
					<>
						<IconButton
							icon="edit"
							onClick={() => setIsOpen(!isOpen)}
						/>
					</>
				)}
			</div>
			<Modal
				isOpen={isOpen || isOpenView}
				cancelButtonHandler={() => modalCloseHandler()}
				confirmButtonHandler={() => {
					onChange("translations", newTranslation);
					modalCloseHandler();
				}}
				header={"Text ändern"}
				buttonDisabled={[false, errors.length > 0]}
				errors={errors}
			>
				<SwitchButtons
					buttonStates={currentStates}
					changeHandler={(value) =>
						setLangState(value.value as LanguageValue)
					}
					currentStates={currentStates.find(
						(l) => l.value === langState
					)}
				/>
				{currentStates.map((lang) => {
					return isOpenView ? (
						<p key={lang.value}>{renderValue}</p>
					) : (
						langState === lang.value && (
							<input
								key={lang.value}
								type={isLink ? "url" : "text"}
								defaultValue={
									get(
										newTranslation,
										`${langState}.${columnKey}`
									) || ""
								}
								onChange={(e) => handleInputChange(e)}
							/>
						)
					);
				})}
			</Modal>
		</div>
	);
};

export default EditStringTranslation;
