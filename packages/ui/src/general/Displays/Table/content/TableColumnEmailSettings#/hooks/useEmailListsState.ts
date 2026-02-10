import { useState, useCallback, useEffect } from "react";
import { PatstoreUser } from "@repo/types";
import { cloneDeep } from "lodash-es";

interface UseEmailListsStateProps {
	emails: PatstoreUser["emails"];
	projectListIds: Set<string>;
}

interface EmailListChange {
	emailIndex: number;
	newLists: string[];
}

export const useEmailListsState = ({
	emails,
	projectListIds
}: UseEmailListsStateProps) => {
	// Local state for email changes
	const [localEmails, setLocalEmails] = useState<PatstoreUser["emails"]>([]);
	const [hasChanges, setHasChanges] = useState<boolean>(false);

	// Initialize local state when emails prop changes
	useEffect(() => {
		setLocalEmails(cloneDeep(emails) || []);
		setHasChanges(false);
	}, [emails]);

	// Update lists for a specific email
	const updateEmailLists = useCallback(
		(emailIndex: number, newProjectLists: string[]) => {
			setLocalEmails((prevEmails) => {
				const updatedEmails = cloneDeep(prevEmails);
				const emailEntry = updatedEmails[emailIndex];

				if (emailEntry) {
					// Get lists from other projects (preserve these)
					const otherProjectLists = emailEntry.lists.filter(
						(listId) => !projectListIds.has(listId)
					);

					// Combine other project lists with new project lists
					emailEntry.lists = [...otherProjectLists, ...newProjectLists];
				}

				return updatedEmails;
			});
			setHasChanges(true);
		},
		[projectListIds]
	);

	// Add a new email address
	const addEmail = useCallback((newEmail: string) => {
		setLocalEmails((prevEmails) => {
			const updatedEmails = cloneDeep(prevEmails);

			// Check if email already exists
			const existingEmail = updatedEmails.find(
				(e) => e.email === newEmail
			);

			if (existingEmail) {
				return prevEmails; // Don't add duplicate
			}

			// Add new email entry
			updatedEmails.push({
				email: newEmail,
				lists: [],
				settings: {}
			});

			return updatedEmails;
		});
		setHasChanges(true);
	}, []);

	// Get the final emails with timestamp updates
	const getFinalEmails = useCallback(
		(originalEmails: PatstoreUser["emails"]) => {
			const finalEmails = cloneDeep(localEmails);
			const now = new Date().toISOString();

			// Compare with original to add timestamps
			finalEmails.forEach((emailEntry, index) => {
				const originalEntry = originalEmails?.[index];

				if (!originalEntry) {
					// New email, no timestamps needed yet
					return;
				}

				// Get current and original project lists
				const currentProjectLists = emailEntry.lists.filter((listId) =>
					projectListIds.has(listId)
				);
				const originalProjectLists = originalEntry.lists.filter(
					(listId) => projectListIds.has(listId)
				);

				// Find lists to add (in current but not in original)
				const listsToAdd = currentProjectLists.filter(
					(listId) => !originalProjectLists.includes(listId)
				);

				// Find lists to remove (in original but not in current)
				const listsToRemove = originalProjectLists.filter(
					(listId) => !currentProjectLists.includes(listId)
				);

				// Update settings with timestamps
				listsToAdd.forEach((listId) => {
					if (!emailEntry.settings[listId]) {
						emailEntry.settings[listId] = {
							optIn: null,
							optOut: null
						};
					}
					emailEntry.settings[listId].optIn = now;
				});

				listsToRemove.forEach((listId) => {
					if (!emailEntry.settings[listId]) {
						emailEntry.settings[listId] = {
							optIn: null,
							optOut: null
						};
					}
					emailEntry.settings[listId].optOut = now;
				});
			});

			return finalEmails;
		},
		[localEmails, projectListIds]
	);

	// Reset to original state
	const reset = useCallback(() => {
		setLocalEmails(cloneDeep(emails) || []);
		setHasChanges(false);
	}, [emails]);

	return {
		localEmails,
		hasChanges,
		updateEmailLists,
		addEmail,
		getFinalEmails,
		reset
	};
};
