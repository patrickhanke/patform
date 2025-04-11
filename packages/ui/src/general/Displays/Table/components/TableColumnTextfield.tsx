"use client";

import { TableColumnTextfieldProps } from "../types";
import { useState } from "react";
import "../styles.scss";
import { Modal, IconButton } from "@repo/ui";

const TableColumnTextfield = ({
	value,
	isEditable = false,
	onChange
}: TableColumnTextfieldProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [string, setString] = useState(value);

	return (
		<>
			<div className="table_column_textfield_container">
				{value ? (
					<span>
						{value.length > 90 ? `${value.slice(0, 90)}...` : value}
					</span>
				) : (
					"-"
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
					<textarea
						defaultValue={value}
						onChange={(e) => setString(e.target.value)}
					/>
				</div>
			</Modal>
		</>
	);
};

export default TableColumnTextfield;
