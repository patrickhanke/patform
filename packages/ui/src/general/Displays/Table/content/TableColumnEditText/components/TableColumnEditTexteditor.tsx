"use client";

import { TableColumnEditTexteditorProps } from "../types";
import { useState } from "react";
import "../../../styles.scss";
import { Editor, Modal } from "@repo/ui";
import { convert } from "html-to-text";

const TableColumnEditTexteditor = ({
	value,
	onChange
}: TableColumnEditTexteditorProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [string, setString] = useState(value);

	return (
		<>
			<div className="table_column_textfield_container">
				<button
					className="full_button sm light"
					type="button"
					onClick={() => setIsOpen(!isOpen)}
				>
					{value && value.length > 0
						? convert(value).trim().split(/\s+/).length
						: "-"}{" "}
					Wörter
				</button>
			</div>
			<Modal
				isOpen={isOpen}
				cancelButtonHandler={() => setIsOpen(false)}
				confirmButtonHandler={() => {
					onChange(string);
					setIsOpen(false);
				}}
				header={"Text"}
				buttonDisabled={[false, false]}
			>
				<div className={"table_column_textfield_textarea_container"}>
					<Editor
						content={string}
						onChange={(newValue) => setString(newValue)}
						withImages
					/>
				</div>
			</Modal>
		</>
	);
};

export default TableColumnEditTexteditor;
