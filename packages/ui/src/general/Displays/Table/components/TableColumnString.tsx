"use client";

import { TableColumnStringProps } from "../types";
import { useState } from "react";
import "../styles.scss";
import { Modal, IconButton } from "@repo/ui";

const TableColumnString = ({
	value,
	isEditable = false,
	onChange
}: TableColumnStringProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [string, setString] = useState(value);

	return (
		<>
			<div className="table_column_textfield_container">
				{value ? value : "-"}

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
				header={"Text ändern"}
				buttonDisabled={[false, !string]}
			>
				<div className={"table_column_textfield_textarea_container"}>
					<input
						defaultValue={value}
						onChange={(e) => setString(e.target.value)}
					/>
				</div>
			</Modal>
		</>
	);
};

export default TableColumnString;
