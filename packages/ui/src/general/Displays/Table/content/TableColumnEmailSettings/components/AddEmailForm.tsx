"use client";

import { FC, useState } from "react";
import { TextInput } from "@repo/ui";
import { Divider } from "../../../../../Layout";

interface AddEmailFormProps {
	onAdd: (email: string) => void;
	onCancel: () => void;
}

const AddEmailForm: FC<AddEmailFormProps> = ({ onAdd, onCancel }) => {
	const [email, setEmail] = useState<string>("");
	const [error, setError] = useState<string>("");

	const validateEmail = (email: string): boolean => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const handleAdd = () => {
		const trimmedEmail = email.trim();
		
		if (!trimmedEmail) {
			setError("Bitte geben Sie eine E-Mail-Adresse ein");
			return;
		}

		if (!validateEmail(trimmedEmail)) {
			setError("Bitte geben Sie eine gültige E-Mail-Adresse ein");
			return;
		}

		onAdd(trimmedEmail);
		setEmail("");
		setError("");
	};

	return (
		<div className="flex col gap-md" style={{ padding: "1rem" }}>
			<div className="flex col gap-sm">
				<h4>Neue E-Mail-Adresse hinzufügen</h4>
				<p style={{ fontSize: "0.9rem", color: "#666" }}>
					Geben Sie eine neue E-Mail-Adresse ein, die zu diesem Benutzer
					hinzugefügt werden soll.
				</p>
			</div>

			<Divider showLine size="small" />

			<div className="flex col gap-sm">
				<label>E-Mail-Adresse</label>
				<TextInput
					id="new-email"
					defaultValue={email}
					onChange={(value) => {
						setEmail(value);
						setError("");
					}}
					placeholder="beispiel@email.de"
					type="email"
				/>
				{error && (
					<p style={{ color: "red", fontSize: "0.85rem", margin: 0 }}>
						{error}
					</p>
				)}
			</div>

			<Divider showLine size="small" />

			<div className="flex row gap-sm">
				<button
					className="full_button md light"
					onClick={onCancel}
					type="button"
				>
					<span>Abbrechen</span>
				</button>
				<button
					className="full_button md primary"
					onClick={handleAdd}
					type="button"
				>
					<span>Hinzufügen</span>
				</button>
			</div>
		</div>
	);
};

export default AddEmailForm;
