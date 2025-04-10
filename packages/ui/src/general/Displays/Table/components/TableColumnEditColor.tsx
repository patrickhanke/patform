"use client";

import { TableColumnEditColorProps } from "../types";
import { useState } from "react";
import "../styles.scss";
import { Modal, IconButton, ColorSelect } from "@repo/ui";

const TableColumnEditColor = ({
	value,
	onChange
}: TableColumnEditColorProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [string, setString] = useState(value);

	return (
		<>
			<div className="table_column_textfield_container">
				{value ? value : "-"}
				<IconButton icon="edit" onClick={() => setIsOpen(!isOpen)} />
			</div>
			<Modal
				isOpen={isOpen}
				cancelButtonHandler={() => setIsOpen(false)}
				confirmButtonHandler={() => {
					onChange(string);
					setIsOpen(false);
				}}
				header={"Beschreibung ändern"}
				buttonDisabled={[false, !string]}
			>
				<div className={"table_column_textfield_textarea_container"}>
					<ColorSelect
						value={string}
						onChange={(color) => {
							setString(color);
						}}
					/>
				</div>
			</Modal>
		</>
	);
};

export default TableColumnEditColor;
