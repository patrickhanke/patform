import { CommentInterface, Loader } from '@content';
import { useDataHandler } from '@provider';
import { ApplicationTypes } from '@types';
import React from 'react';

const TaskComments = ({taskId, comments, refetch}: {taskId: string, comments: ApplicationTypes.Comment[], refetch: () => void}) => {
	const {updateData} = useDataHandler();
	
	const addCommentHandler = async (value: ApplicationTypes.Comment[]) => {
		await updateData({
			className: 'Task',
			objectId: taskId,
			updateObject: {
				comments: value
			}
		});
		refetch();
	};

	if (comments) return (
		<CommentInterface comments={comments} addComment={addCommentHandler} />
	);
	return <Loader width='100%' height='120px' />;
};

export default TaskComments;