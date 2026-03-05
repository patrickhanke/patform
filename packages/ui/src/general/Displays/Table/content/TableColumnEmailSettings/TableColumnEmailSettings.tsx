"use client";

import { IconButton, SlideIn } from "@repo/ui";
import React, { useState, useMemo, useCallback, useContext } from "react";
import {
	useDataHandlerSecure,
	PatstoreAppContext,
	useFindData
} from "@repo/provider";
import { PatstoreUser, ApolloRefetch } from "@repo/types";
import EmailList from "./components/EmailList";
import EmailListManager from "./components/EmailListManager";
import AddEmailForm from "./components/AddEmailForm";
import { useEmailListsState } from "./hooks/useEmailListsState";

interface TableColumnEmailSettingsProps {
	userId: string;
	emails: PatstoreUser["emails"];
	refetch: ApolloRefetch;
}

const TableColumnEmailSettings: React.FC<TableColumnEmailSettingsProps> = ({
	userId,
	emails,
	refetch
}) => {
	const { updateData } = useDataHandlerSecure(true);
	const { project } = useContext(PatstoreAppContext);
	const [emailSettings, setEmailSettings] = useState<boolean>(false);
	const [selectedEmail, setSelectedEmail] = useState<{
		email: string;
		index: number;
	} | null>(null);
	const [showAddEmail, setShowAddEmail] = useState<boolean>(false);
	const [isUpdating, setIsUpdating] = useState<boolean>(false);

	// Fetch all lists from current project
	const { data: projectLists, loading: listsLoading } = useFindData({
		objectName: "Item",
		fields: ["objectId", "title"],
		filters: [
			{
				key: "type",
				value: "list",
				operator: "equalTo"
			}
		],
		limit: 1000,
		skip: 0,
		order: "title_ASC",
		projectId: project.objectId
	});

	// Create a set of project list IDs for quick lookup
	const projectListIds = useMemo(() => {
		return new Set(projectLists?.map((list: any) => list.objectId) || []);
	}, [projectLists]);

	// Use custom hook for managing email state
	const {
		localEmails,
		hasChanges,
		updateEmailLists,
		addEmail,
		getFinalEmails,
		reset
	} = useEmailListsState({ emails, projectListIds });

	// Handle email click to show list management
	const handleEmailClick = useCallback((email: string, index: number) => {
		setSelectedEmail({ email, index });
		setShowAddEmail(false);
	}, []);

	// Handle adding new email
	const handleAddNewEmail = useCallback(() => {
		setShowAddEmail(true);
		setSelectedEmail(null);
	}, []);

	// Handle closing secondary content
	const handleCloseSecondary = useCallback(() => {
		setSelectedEmail(null);
		setShowAddEmail(false);
	}, []);

	// Handle list changes for a specific email (local state only)
	const handleListsChange = useCallback(
		(newLists: string[]) => {
			if (!selectedEmail) return;
			updateEmailLists(selectedEmail.index, newLists);
		},
		[selectedEmail, updateEmailLists]
	);

	// Handle adding new email address (local state only)
	const handleAddEmail = useCallback(
		(newEmail: string) => {
			// Check if email already exists in local state
			const existingEmail = localEmails.find((e) => e.email === newEmail);

			if (existingEmail) {
				alert("Diese E-Mail-Adresse existiert bereits");
				return;
			}

			addEmail(newEmail);
			setShowAddEmail(false);
		},
		[localEmails, addEmail]
	);

	// Handle cancel - reset to original state
	const handleCancel = useCallback(() => {
		reset();
		setEmailSettings(false);
		setSelectedEmail(null);
		setShowAddEmail(false);
	}, [reset]);

	// Handle confirm - save changes to database
	const handleConfirm = useCallback(async () => {
		if (isUpdating) return;

		// If no changes, just close
		if (!hasChanges) {
			setEmailSettings(false);
			setSelectedEmail(null);
			setShowAddEmail(false);
			return;
		}

		setIsUpdating(true);

		try {
			const finalEmails = getFinalEmails(emails);

			await updateData({
				className: "User",
				objectId: userId,
				updateObject: {
					emails: finalEmails
				},
				feedback: "E-Mail-Einstellungen gespeichert"
			});

			await refetch();
			setEmailSettings(false);
			setSelectedEmail(null);
			setShowAddEmail(false);
		} catch (error) {
			console.error("Error saving email settings:", error);
		} finally {
			setIsUpdating(false);
		}
	}, [
		isUpdating,
		hasChanges,
		getFinalEmails,
		emails,
		updateData,
		userId,
		refetch
	]);

	// Get secondary content
	const secondaryContent = useMemo(() => {
		if (selectedEmail) {
			const emailEntry = localEmails?.[selectedEmail.index];
			// Filter to only show project lists
			const currentProjectLists =
				emailEntry?.lists?.filter((listId) =>
					projectListIds.has(listId)
				) || [];

			return (
				<EmailListManager
					email={selectedEmail.email}
					currentLists={currentProjectLists}
					projectLists={projectLists || []}
					listsLoading={listsLoading}
					onListsChange={handleListsChange}
					onClose={handleCloseSecondary}
				/>
			);
		}

		if (showAddEmail) {
			return (
				<AddEmailForm
					onAdd={handleAddEmail}
					onCancel={handleCloseSecondary}
				/>
			);
		}

		return null;
	}, [
		selectedEmail,
		showAddEmail,
		localEmails,
		projectLists,
		projectListIds,
		listsLoading,
		handleListsChange,
		handleAddEmail,
		handleCloseSecondary
	]);

	return (
		<>
			<div>
				<IconButton
					icon="email"
					onClick={() => setEmailSettings(true)}
				/>
			</div>
			<SlideIn
				isOpen={emailSettings}
				header="E-Mail-Einstellungen"
				cancel={handleCancel}
				confirm={handleConfirm}
				confirmText="Speichern"
				disabled={[isUpdating, isUpdating]}
				loading={isUpdating}
				secondaryContent={secondaryContent}
				showSecondaryContent={!!secondaryContent}
			>
				<EmailList
					emails={localEmails || []}
					projectListIds={projectListIds}
					onEmailClick={handleEmailClick}
					onAddEmail={handleAddNewEmail}
				/>
			</SlideIn>
		</>
	);
};

export default TableColumnEmailSettings;
