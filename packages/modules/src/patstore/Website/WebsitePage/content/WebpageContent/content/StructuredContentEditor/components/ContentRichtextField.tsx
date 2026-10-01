"use client";

import { TableColumnEditText } from "@repo/ui";
import { FC, useEffect, useState } from "react";
import { ClassTranslation } from "@repo/types";

type ContentRichtextFieldProps = {
	value?: string;
	onChange: (value: string) => void;
};

/**
 * Richtext field using the same modal Editor flow as TableColumnTexteditor.
 * Persists HTML as a string.
 */
const ContentRichtextField: FC<ContentRichtextFieldProps> = ({
	value = "",
	onChange
}) => {
	const [editorValue, setEditorValue] = useState(value || "");

	useEffect(() => {
		setEditorValue(value || "");
	}, [value]);
	return (
		<TableColumnEditText
			type="texteditor"
			columnKey="richtext"
			value={editorValue}
			onChange={(_key: string, nextValue: string | ClassTranslation) => {
				if (typeof nextValue === "string") {
					setEditorValue(nextValue);
					onChange(nextValue);
				}
			}}
		/>
	);
};

export default ContentRichtextField;
