import { Loader } from '@/_UI';
import { useDataHandler } from '@/provider';
import { ApplicationTypes, TicketTypes } from '@/types';
import React from 'react';
import { CommentInterface } from '@/_UI';

const TicketComments = ({ticketId, comments, refetch}: TicketTypes.TicketCommentsProps) => {
	const {updateData} = useDataHandler();
	
	const addCommentHandler = async (value: ApplicationTypes.Comment[]) => {
		await updateData({
			className: 'Ticket',
			objectId: ticketId,
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

export default TicketComments;