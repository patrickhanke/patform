"use client";

import { TableColumnTexteditor } from "@repo/ui";
import { FC, useEffect, useState } from "react";

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
		<TableColumnTexteditor
			value={editorValue}
			onChange={(nextValue) => {
				setEditorValue(nextValue);
				onChange(nextValue);
			}}
		/>
	);
};

export default ContentRichtextField;
