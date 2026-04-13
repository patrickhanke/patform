import { FC, useCallback, useMemo, useState } from "react";
import { Modal } from "@repo/ui";
import { TaskModalProps } from "../types";
import { useDataHandler } from "@repo/provider";

const TaskModal: FC<TaskModalProps> = ({
	isOpen,
	setIsOpen,
	type,
	tasks = []
}) => {
	const { updateData } = useDataHandler();

	const [loading, setLoading] = useState(false);

	const archiveTasks = useCallback(() => {
		if (type === "archive") {
			return async (objectId: string) => {
				await updateData({
					className: "Task",
					objectId,
					updateObject: {
						state: "archived"
					},
					feedback: "Aufgaben archiviert"
				});
			};
		} else {
			return async (objectId: string) => {
				await updateData({
					className: "Task",
					objectId,
					updateObject: {
						state: "completed"
					},
					feedback: "Aufgaben geschlossen"
				});
			};
		}
	}, [type]);

	const modalProps = useMemo(() => {
		if (type === "archive") {
			return {
				header: "Aufgabe archivieren",
				body: `Möchten Sie die ${tasks.length} ausgewählten Aufgaben wirklich archivieren?`,
				confirmText: "Archivieren",
				cancelText: "Abbrechen",
				confirmAction: async () => {
					setLoading(true);
					await Promise.all(tasks.map(archiveTasks()));
					setLoading(false);
					setIsOpen(false);
				}
			};
		} else {
			return {
				header: "Aufgabe schließen",
				body: `Möchten Sie die ${tasks.length} ausgewählten Aufgaben wirklich schließen?`,
				confirmText: "Schließen",
				cancelText: "Abbrechen",
				confirmAction: async () => {
					setLoading(true);
					await Promise.all(tasks.map(archiveTasks()));
					setLoading(false);
					setIsOpen(false);
				}
			};
		}
	}, [tasks, type]);

	if (!type) {
		return null;
	}

	return (
		<Modal
			cancelButtonHandler={() => setIsOpen(false)}
			confirmButtonHandler={modalProps.confirmAction}
			isOpen={isOpen}
			header={modalProps.header}
			confirmButtonText={modalProps.confirmText}
			buttonDisabled={[loading, loading]}
		>
			<p>{modalProps.body}</p>
		</Modal>
	);
};

export default TaskModal;
