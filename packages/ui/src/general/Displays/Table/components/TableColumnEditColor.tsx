"use client";

import { TableColumnEditColorProps } from "../types";
import { useState } from "react";
import "../styles.scss";
import { Modal, IconButton, ColorSelect } from "@repo/ui";
import colors from "../../../Inputs/ColorSelect/constants/colors";

const TableColumnEditColor = ({
	value,
	onChange
}: TableColumnEditColorProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [string, setString] = useState(value);

	return (
		<>
			<div className="table_column_textfield_container">
				<IconButton
					icon="edit"
					text={colors.find((color) => color.value === value)?.label}
					onClick={() => setIsOpen(!isOpen)}
				/>
			</div>
			<Modal
				isOpen={isOpen}
				cancelButtonHandler={() => setIsOpen(false)}
				confirmButtonHandler={() => {
					onChange(string);
					setIsOpen(false);
				}}
				header={"Farbe ändern"}
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
