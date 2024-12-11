import React from 'react';
import styles from '../CommentInterface.module.scss';
import { DateDisplay } from '@repo/ui';
import { GoComment } from 'react-icons/go';
import { Comment as CommentType } from '@/types';
import { DisplayWorker } from '@/content/_UI/Workers';

const Comment = ({comment} : {comment: CommentType}) => {
	return (
		<div className={styles.comment_container}> 
			<div className={styles.comment_header}>
				{comment.user && <DisplayWorker workerId={comment.user.objectId} />}
				{!comment.user && <div>{comment.username}</div>}
				<DateDisplay date={comment.createdAt} displayType='date-and-time' />
			</div>
			<div className={styles.comment_content}>
				<div className={styles.comment_content_icon}>
					<GoComment />
				</div>
				<div className={styles.comment_content_text}>
					<p>
						{comment.text}
					</p>
				</div>
			</div>

		</div>
	);
};

export default Comment;