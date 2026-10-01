"use client";

import { TableColumnStringProps } from "../types";
import { useCallback, useState } from "react";
import { Modal, IconButton } from "@repo/ui";
import { ErrorMessage } from "@repo/types";

export const TableColumnEditString = ({
	value,
	columnKey,
	isEditable = false,
	isLink = false,
	onChange
}: TableColumnStringProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [string, setString] = useState(value);
	const [isOpenView, setIsOpenView] = useState(false);
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

	const modalCloseHandler = useCallback(() => {
		setIsOpen(false);
		setIsOpenView(false);
	}, []);

	return (
		<>
			<div className="table_column_textfield_container">
				<span>
					{value
						? value.length > 30
							? value.slice(0, 30) + "..."
							: value
						: "-"}
				</span>
				<div className="button_container">
					{value && value.length > 30 && (
						<IconButton
							icon="eye"
							onClick={() => setIsOpenView(!isOpenView)}
						/>
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
			</div>
			<Modal
				isOpen={isOpen || isOpenView}
				cancelButtonHandler={() => modalCloseHandler()}
				confirmButtonHandler={() => {
					onChange(columnKey, string);
					modalCloseHandler();
				}}
				header={"Text ändern"}
				buttonDisabled={[false, errors.length > 0]}
				errors={errors}
			>
				{isEditable ? (
					<div
						className={"table_column_textfield_textarea_container"}
					>
						{isOpenView ? (
							<p>{value}</p>
						) : (
							<input
								type={isLink ? "url" : "text"}
								defaultValue={value}
								onChange={handleInputChange}
							/>
						)}
					</div>
				) : (
					<p>{value}</p>
				)}
			</Modal>
		</>
	);
};

export default TableColumnEditString;
