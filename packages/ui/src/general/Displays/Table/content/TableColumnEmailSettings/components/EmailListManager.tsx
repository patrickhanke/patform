"use client";

import { FC, useMemo, useState, useCallback, useEffect } from "react";
import {
	ElementSelectInterface,
	IconButton,
	Modal,
	SelectElement
} from "@repo/ui";
import { Divider } from "@repo/ui";
import { EmailListManagerProps } from "../types";

const validateEmailFormat = (value: string): boolean => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(value);
};

const EmailListManager: FC<EmailListManagerProps> = ({
	email,
	currentLists,
	projectLists,
	listsLoading,
	onListsChange,
	onClose,
	onEmailChange,
	onEmailDelete
}) => {
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [editEmailDraft, setEditEmailDraft] = useState(email);
	const [editError, setEditError] = useState("");

	useEffect(() => {
		if (editModalOpen) {
			setEditEmailDraft(email);
			setEditError("");
		}
	}, [editModalOpen, email]);

	const handleOpenEdit = useCallback(() => {
		setEditEmailDraft(email);
		setEditError("");
		setEditModalOpen(true);
	}, [email]);

	const handleConfirmEdit = useCallback(() => {
		const trimmed = editEmailDraft.trim();
		if (!trimmed) {
			setEditError("Bitte geben Sie eine E-Mail-Adresse ein");
			return;
		}
		if (!validateEmailFormat(trimmed)) {
			setEditError("Bitte geben Sie eine gültige E-Mail-Adresse ein");
			return;
		}
		const ok = onEmailChange(trimmed);
		if (ok) {
			setEditModalOpen(false);
			setEditError("");
		}
	}, [editEmailDraft, onEmailChange]);

	const handleConfirmDelete = useCallback(() => {
		setDeleteModalOpen(false);
		onEmailDelete();
	}, [onEmailDelete]);

	// Convert lists to SelectElement format
	const elements = useMemo(() => {
		const listOptionsArray: SelectElement[] = [];
		if (projectLists && projectLists.length > 0) {
			projectLists.forEach(
				(list: { objectId: string; title: string }) => {
					listOptionsArray.push({
						value: list.objectId,
						id: list.objectId,
						label: list.title || "Unbenannte Liste"
					});
				}
			);
		}
		listOptionsArray.sort((a, b) => a.label?.localeCompare(b.label));

		return listOptionsArray;
	}, [projectLists]);

	// Get selected elements
	const selectedElements = useMemo(() => {
		return elements.filter((element) => currentLists.includes(element.id));
	}, [elements, currentLists]);

	return (
		<div className="flex col gap-md" style={{ padding: "1rem" }}>
			<div className="flex row a-ce j-sb gap-sm">
				<div
					className="flex col gap-xs"
					style={{ flex: 1, minWidth: 0 }}
				>
					<h4>Listen verwalten</h4>
					<p style={{ fontSize: "0.85rem", color: "#666" }}>
						{email}
					</p>
					<p
						style={{
							fontSize: "0.75rem",
							color: "#999",
							fontStyle: "italic"
						}}
					>
						Nur Listen des aktuellen Projekts werden angezeigt
					</p>
				</div>
				<div className="flex row gap-xs" style={{ flexShrink: 0 }}>
					<IconButton icon="edit" onClick={handleOpenEdit} />
					<IconButton
						icon="delete"
						onClick={() => setDeleteModalOpen(true)}
					/>
				</div>
			</div>

			<Modal
				isOpen={editModalOpen}
				header="E-Mail-Adresse bearbeiten"
				cancelButtonHandler={() => {
					setEditModalOpen(false);
					setEditError("");
				}}
				confirmButtonHandler={handleConfirmEdit}
				confirmButtonText="Speichern"
			>
				<div className="flex col gap-sm">
					<label htmlFor="edit-email-address">E-Mail-Adresse</label>
					<input
						id="edit-email-address"
						type="email"
						style={{ width: "100%", boxSizing: "border-box" }}
						value={editEmailDraft}
						onChange={(e) => {
							setEditEmailDraft(e.target.value);
							setEditError("");
						}}
						placeholder="beispiel@email.de"
						autoComplete="email"
					/>
					{editError ? (
						<p
							style={{
								color: "red",
								fontSize: "0.85rem",
								margin: 0
							}}
						>
							{editError}
						</p>
					) : null}
				</div>
			</Modal>

			<Modal
				isOpen={deleteModalOpen}
				header="E-Mail-Adresse löschen"
				cancelButtonHandler={() => setDeleteModalOpen(false)}
				confirmButtonHandler={handleConfirmDelete}
				confirmButtonText="Löschen"
			>
				<p>
					Möchten Sie diese E-Mail-Adresse wirklich entfernen? Die
					Zuordnung zu Listen für diese Adresse geht verloren, bis Sie
					sie erneut hinzufügen.
				</p>
			</Modal>

			<Divider showLine size="small" />

			{listsLoading ? (
				<p style={{ textAlign: "center", color: "#666" }}>Lädt...</p>
			) : (
				<ElementSelectInterface
					title="Verfügbare Listen"
					elements={elements}
					selectedElements={selectedElements}
					onSelect={(selectedItems) => {
						const selectedIds = selectedItems.map(
							(item) => item.id
						);
						onListsChange(selectedIds);
					}}
					max={999}
					isSearchable
					isClearable
					setSelectedToTop
				/>
			)}

			<Divider showLine size="small" />

			<div className="flex row gap-sm">
				<IconButton onClick={onClose} text="Zurück" />
			</div>
		</div>
	);
};

export default EmailListManager;
