import { CommentInterface } from "@repo/ui";
import { useDataHandler } from "@repo/provider";
import { Comment } from "@repo/types";
import { Loader } from "@repo/ui";
import React from "react";

const TaskComments = ({
	taskId,
	comments,
	refetch,
	isEditable = true
}: {
	taskId: string;
	comments: Comment[];
	refetch: () => void;
	isEditable?: boolean;
}) => {
	const { updateData } = useDataHandler();

	const addCommentHandler = async (value: Comment[]) => {
		await updateData({
			className: "Task",
			objectId: taskId,
			updateObject: {
				comments: value
			}
		});
		refetch();
	};

	if (comments)
		return (
			<CommentInterface
				comments={comments}
				addComment={addCommentHandler}
				isEditable={isEditable}
			/>
		);
	return <Loader width="100%" height="120px" />;
};

export default TaskComments;
