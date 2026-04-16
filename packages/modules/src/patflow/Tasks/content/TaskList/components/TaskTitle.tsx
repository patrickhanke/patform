"use client";

import { useDataHandler } from "@repo/provider";
import { useCallback, useState } from "react";
import styles from "../Task.module.scss";
import { IconButton, Modal, TextInput } from "@repo/ui";

const TaskTitle = ({
	taskId,
	taskState,
	taskTitle
}: {
	taskId: string;
	taskState: string;
	taskTitle: string;
}) => {
	const [title, setTitle] = useState(taskTitle || "");
	const { updateData } = useDataHandler();
	const [titleEdit, setTitleEdit] = useState(false);

	const titleDataHandler = useCallback(async () => {
		await updateData({
			className: "Task",
			objectId: taskId,
			updateObject: {
				title
			}
		});
		setTitleEdit(false);
	}, [title]);

	if (taskState === "completed" || taskState === "archived") {
		return <div className={styles.task_title_container}>{taskTitle}</div>;
	}

	return (
		<>
			<div className={styles.task_title_container}>
				<div style={{ flex: "1", display: "inline-flex" }}>
					<p style={{ textWrap: "wrap" }}>{taskTitle}</p>
				</div>
				<IconButton icon="edit" onClick={() => setTitleEdit(true)} />
			</div>
			<Modal
				isOpen={titleEdit}
				cancelButtonHandler={() => setTitleEdit(false)}
				confirmButtonHandler={() => titleDataHandler()}
				header="Titel bearbeiten"
				buttonDisabled={[false, false]}
			>
				<TextInput
					id="task_title"
					label=""
					defaultValue={taskTitle}
					onChange={(value) => setTitle(value)}
				/>
			</Modal>
		</>
	);
};

export default TaskTitle;
