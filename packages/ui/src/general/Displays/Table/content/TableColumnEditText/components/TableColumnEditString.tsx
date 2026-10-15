"use client";

import { TableColumnStringProps } from "../types";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Modal, IconButton } from "@repo/ui";
import { ErrorMessage } from "@repo/types";
import { useAppContext } from "@repo/provider";

const MIN_INPUT_WIDTH = 360;

const fitInputToText = (input: HTMLInputElement, mirror: HTMLSpanElement) => {
	const style = window.getComputedStyle(input);
	mirror.style.fontFamily = style.fontFamily;
	mirror.style.fontSize = style.fontSize;
	mirror.style.fontWeight = style.fontWeight;
	mirror.style.fontStyle = style.fontStyle;
	mirror.style.letterSpacing = style.letterSpacing;
	mirror.textContent = input.value;

	const textWidth = mirror.getBoundingClientRect().width;
	const chrome =
		(parseFloat(style.paddingLeft) || 0) +
		(parseFloat(style.paddingRight) || 0) +
		(parseFloat(style.borderLeftWidth) || 0) +
		(parseFloat(style.borderRightWidth) || 0);

	input.style.width = `${Math.max(
		MIN_INPUT_WIDTH,
		Math.ceil(textWidth + chrome)
	)}px`;
};

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
	const inputRef = useRef<HTMLInputElement>(null);
	const mirrorRef = useRef<HTMLSpanElement>(null);
	const { project } = useAppContext();

	const resizeInput = useCallback(() => {
		if (!inputRef.current || !mirrorRef.current) return;
		fitInputToText(inputRef.current, mirrorRef.current);
	}, []);

	useLayoutEffect(() => {
		if (!isOpen || isOpenView) return;
		resizeInput();
	}, [isOpen, isOpenView, string, resizeInput]);

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
				styles={{ width: "fit-content", minWidth: "420px" }}
			>
				{isEditable ? (
					<div
						className={"table_column_textfield_textarea_container"}
						style={{ position: "relative" }}
					>
						{isOpenView ? (
							<p>{value}</p>
						) : (
							<>
								<span
									ref={mirrorRef}
									aria-hidden
									style={{
										position: "absolute",
										visibility: "hidden",
										whiteSpace: "pre",
										width: "max-content",
										pointerEvents: "none"
									}}
								/>
								<input
									ref={inputRef}
									type={isLink ? "url" : "text"}
									defaultValue={value}
									onChange={handleInputChange}
									style={{ minWidth: MIN_INPUT_WIDTH }}
								/>
								{project.objectId === "lt4HonzqK3" && (
									<div style={{ marginTop: "12px" }}>
										<p>
											Textinput wurde auf Susis Wunsch
											vergrößert!
										</p>
									</div>
								)}
							</>
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
