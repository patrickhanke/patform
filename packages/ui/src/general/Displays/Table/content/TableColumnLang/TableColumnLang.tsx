import { LanguageValue } from "@repo/types";
import { Select } from "@repo/ui";
import { languages_short } from "@repo/provider";

const TableColumnLang = ({
	languages,
	value,
	onChange
}: {
	languages: LanguageValue[];
	value: LanguageValue;
	onChange: (value: LanguageValue) => void;
}) => {
	const selectOptions = languages.map((language) => ({
		value: language,
		label:
			languages_short.find((lng) => lng.value === language)?.label ||
			language
	}));

	console.log("languages", languages);
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

	return (
		<div>
			<Select
				options={selectOptions}
				value={value}
				onChange={(selectValue) =>
					onChange(selectValue.value as LanguageValue)
				}
			/>
		</div>
	);
};

export default TableColumnLang;
