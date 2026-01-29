"use client";

import { FC, useCallback, useState } from "react";
import { SlideIn, StateDisplay, TextInput } from "@repo/ui";
import { useDataHandlerSecure } from "@repo/provider";
import { ApolloRefetch, PatstoreUser } from "@repo/types";
import { cloneDeep } from "lodash-es";

export interface MemberSwitchProps {
	listId: string;
	emails: PatstoreUser["emails"] | undefined;
	userId: string;
	refetch: ApolloRefetch;
}

const MemberSwitch: FC<MemberSwitchProps> = ({
	listId,
	emails,
	userId,
	refetch
}) => {
	const { updateData } = useDataHandlerSecure(true);
	const [isUpdating, setIsUpdating] = useState(false);
	const [isSlideInOpen, setIsSlideInOpen] = useState(false);
	const [selectedEmail, setSelectedEmail] = useState<string>("");
	const [newEmailInput, setNewEmailInput] = useState<string>("");

	const isInList =
		emails?.some((email) => email.lists.includes(listId)) || false;

	const handleToggle = useCallback(async () => {
		if (isUpdating) return;

		if (isInList) {
			// Remove from list
			setIsUpdating(true);
			try {
				const updatedEmails: PatstoreUser["emails"] =
					cloneDeep(emails) || [];
				const email = updatedEmails?.find((email) =>
					email.lists.includes(listId)
				);

				if (email) {
					// Remove list from lists array
					email.lists = email.lists.filter((list) => list !== listId);

					// Add optOut timestamp to settings
					if (!email.settings[listId]) {
						email.settings[listId] = {
							optIn: null,
							optOut: null
						};
					}
					email.settings[listId].optOut = new Date().toISOString();
				}

				await updateData({
					className: "_User",
					objectId: userId,
					updateObject: {
						emails: updatedEmails
					},
					feedback: "Benutzer aus Liste entfernt"
				});

				await refetch();
			} catch (error) {
				console.error("Error removing user from list:", error);
			} finally {
				setIsUpdating(false);
			}
		} else {
			// Add to list - open SlideIn
			setIsSlideInOpen(true);
		}
	}, [listId, emails, userId, isInList, updateData, refetch, isUpdating]);

	const handleConfirmAddToList = useCallback(async () => {
		if (isUpdating) return;

		const emailToAdd = newEmailInput.trim() || selectedEmail;

		if (!emailToAdd) {
			return;
		}

		setIsUpdating(true);

		try {
			const updatedEmails: PatstoreUser["emails"] =
				cloneDeep(emails) || [];

			// Find existing email entry or create new one
			const emailEntry = updatedEmails.find(
				(e) => e.email === emailToAdd
			);

			if (emailEntry) {
				// Add list to existing email entry
				if (!emailEntry.lists.includes(listId)) {
					emailEntry.lists.push(listId);
				}

				// Add optIn timestamp to settings
				if (!emailEntry.settings[listId]) {
					emailEntry.settings[listId] = {
						optIn: null,
						optOut: null
					};
				}
				emailEntry.settings[listId].optIn = new Date().toISOString();
			} else {
				// Create new email entry
				updatedEmails.push({
					email: emailToAdd,
					lists: [listId],
					settings: {
						[listId]: {
							optIn: new Date().toISOString(),
							optOut: null
						}
					}
				});
			}

			await updateData({
				className: "_User",
				objectId: userId,
				updateObject: {
					emails: updatedEmails
				},
				feedback: "Benutzer zur Liste hinzugefügt"
			});

			await refetch();
			setIsSlideInOpen(false);
			setSelectedEmail("");
			setNewEmailInput("");
		} catch (error) {
			console.error("Error adding user to list:", error);
		} finally {
			setIsUpdating(false);
		}
	}, [
		listId,
		emails,
		userId,
		updateData,
		refetch,
		isUpdating,
		selectedEmail,
		newEmailInput
	]);

	const handleCancelSlideIn = useCallback(() => {
		setIsSlideInOpen(false);
		setSelectedEmail("");
		setNewEmailInput("");
	}, []);

	return (
		<>
			<StateDisplay
				label={isInList ? "Ja" : "Nein"}
				color={isInList ? "green" : "red"}
				onClick={handleToggle}
			/>

			<SlideIn
				isOpen={isSlideInOpen}
				header="E-Mail-Adresse auswählen"
				cancel={handleCancelSlideIn}
				confirm={handleConfirmAddToList}
				disabled={[
					isUpdating,
					isUpdating || (!selectedEmail && !newEmailInput.trim())
				]}
				loading={isUpdating}
				confirmText="Zur Liste hinzufügen"
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "1rem"
					}}
				>
					<div>
						<h4 style={{ marginBottom: "0.5rem" }}>
							Vorhandene E-Mail-Adressen
						</h4>
						{emails && emails.length > 0 ? (
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									gap: "0.5rem"
								}}
							>
								{emails.map((emailEntry, index) => (
									<label
										key={index}
										style={{
											display: "flex",
											alignItems: "center",
											gap: "0.5rem",
											cursor: "pointer",
											padding: "0.5rem",
											border: "1px solid #ddd",
											borderRadius: "4px",
											backgroundColor:
												selectedEmail ===
													emailEntry.email &&
												!newEmailInput
													? "#f0f0f0"
													: "transparent"
										}}
									>
										<input
											type="radio"
											name="email-selection"
											value={emailEntry.email}
											checked={
												selectedEmail ===
													emailEntry.email &&
												!newEmailInput
											}
											onChange={(e) => {
												setSelectedEmail(
													e.target.value
												);
												setNewEmailInput("");
											}}
										/>
										<span>{emailEntry.email}</span>
									</label>
								))}
							</div>
						) : (
							<p style={{ color: "#666" }}>
								Keine E-Mail-Adressen vorhanden
							</p>
						)}
					</div>

					<div>
						<h4 style={{ marginBottom: "0.5rem" }}>
							Oder neue E-Mail-Adresse eingeben
						</h4>
						<TextInput
							id="new-email-input"
							defaultValue={newEmailInput}
							onChange={(value) => {
								setNewEmailInput(value);
								setSelectedEmail("");
							}}
							placeholder="neue@email.de"
							type="email"
						/>
					</div>
				</div>
			</SlideIn>
		</>
	);
};

export default MemberSwitch;
