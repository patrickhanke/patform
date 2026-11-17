import { LanguageValue } from "@repo/types";
import { ElementSelectInterface, SlideIn } from "@repo/ui";
import { languages_short, toLocaleKey } from "@repo/provider";
import { useMemo, useState } from "react";

const TableColumnLang = ({
	languages,
	value,
	onChange,
	isEditable = true
}: {
	languages: LanguageValue[];
	value: LanguageValue;
	onChange: (value: LanguageValue) => void;
	isEditable?: boolean;
}) => {
	const [isOpen, setIsOpen] = useState(false);

	const selectOptions = languages.map((language) => {
		const locale = toLocaleKey(language);
		return {
			value: locale,
			label:
				languages_short.find((lng) => lng.value === locale)?.label ||
				locale
		};
	});

	console.log("languages", languages);
	console.log("value", value);
	if (languages.length < 2 && !value) {
		return <div>-</div>;
	}

	if (languages.length < 2 && !!value) {
		return (
			<div>
				{languages_short.find((lng) => lng.value === value)?.label ||
					value}
			</div>
		);
	}

	const selectPerson = useMemo(
		() => (
			<ElementSelectInterface
				elements={selectOptions}
				selectedElements={
					selectOptions.find(
						(option) => option.value === toLocaleKey(value)
					)
						? [
								selectOptions.find(
									(option) =>
										option.value === toLocaleKey(value)
								)!
							]
						: []
				}
				onSelect={(selectValue) => {
					onChange(selectValue[0]?.value as LanguageValue);
				}}
				max={1}
			/>
		),
		[selectOptions, value]
	);

	const selectedLanguage = useMemo(() => {
		return (
			selectOptions.find(
				(option) => option.value === toLocaleKey(value)
			) || null
		);
	}, [selectOptions, value]);

	return (
		<div>
			<button
				className={"full_button sm light"}
				onClick={() => {
					if (isEditable) {
						setIsOpen(true);
					}
				}}
			>
				<div>
					{selectedLanguage ? (
						<span>{selectedLanguage.label}</span>
					) : (
						<span>+ Person hinzufügen</span>
					)}
				</div>
			</button>
			<SlideIn
				isOpen={isOpen}
				cancel={() => setIsOpen(false)}
				confirm={async () => {
					if (selectedLanguage) {
						if (onChange) {
							onChange(selectedLanguage.value);
						}
					}
				}}
				disabled={[false, !selectedLanguage]}
				header="Personen auswählen"
			>
				{selectPerson}
			</SlideIn>
		</div>
	);
};

export default TableColumnLang;
