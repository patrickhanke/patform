"use client";

import { TableColumnStringProps } from "../types";
import { useState } from "react";
import "../styles.scss";
import { Modal, IconButton } from "@repo/ui";
import { ErrorMessage } from "@repo/types";

const TableColumnString = ({
	value,
	isEditable = false,
	isLink = false,
	onChange
}: TableColumnStringProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [string, setString] = useState(value);
	const [errors, setErrors] = useState<ErrorMessage[]>([]);

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

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;
		setString(newValue);

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
	};

	return (
		<>
			<div className="table_column_textfield_container">
				{value
					? value.length > 30
						? value.slice(0, 30) + "..."
						: value
					: "-"}

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
				buttonDisabled={[false, errors.length > 0]}
				errors={errors}
			>
				<div className={"table_column_textfield_textarea_container"}>
					<input
						type={isLink ? "url" : "text"}
						defaultValue={value}
						onChange={handleInputChange}
					/>
				</div>
			</Modal>
		</>
	);
};

export default TableColumnString;
