import TextInput from '@/_UI/interfaces/TextInput';
import { UserContext } from '@/provider';
import React, { useContext, useState } from 'react';
import styles from '../CommentInterface.module.scss';
import clsx from 'clsx';
import { CreateCommentProps } from '../types';

const CreateComment = ({addCommentHandler}: CreateCommentProps) => {
	const {user} = useContext(UserContext);
	const [comment, setComment] = useState('');

	return ( 
		<div className={styles.create_comment_container}>
			<TextInput
				defaultValue={comment}
				label='Neuer Kommentar'
				id='comment'
				onChange={value => setComment(value)}
				isTextArea
				width='100%'
			/>
			<div className='button_container'>
				<button 
					className={clsx('full_button', 'sm', 'dark')}
					onClick={() => {
						addCommentHandler({
							userId: user.objectId,
							username: `${user.first_name} ${user.family_name}`,
							createdAt: new Date().toISOString(),
							text: comment
						});
						setComment('');
					}}
				>
                    Kommentar hinzufügen
				</button>
				<button 
					className={clsx('full_button', 'sm', 'light')}
					onClick={() => {
						setComment('');
					}}
				>
                    Abbrechen
				</button>
			</div>
		</div> 
	);
};

export default CreateComment;