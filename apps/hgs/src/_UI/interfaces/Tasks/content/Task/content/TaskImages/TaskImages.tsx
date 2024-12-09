import { useDataHandler } from '@/provider';
import React, { useCallback } from 'react';
import styles from './TaskImages.module.scss';
import { ImageDisplay, ImageUploader } from '@/_UI/interfaces/Images';
import { Image } from '@/types';

const TaskImages = ({taskId, taskName, refetch, images}: {taskId: string, taskName: string, images: Image[], refetch: () => void}) => {
	const {updateData} = useDataHandler();

	const addImageHandler = useCallback(async (content: Image[]) => {
		const newImages = [...images, ...content];

		await updateData({
			className: 'Task',
			objectId: taskId,
			updateObject: {
				images: newImages
			}
		});
		refetch();
	}, [images]);

	const removeImageHandler = useCallback(async (content: Image) => {
		const newImages = [...images];
		newImages.splice(newImages.indexOf(content), 1);

		await updateData({
			className: 'Task',
			objectId: taskId,
			updateObject: {
				images: newImages
			}
		});
		refetch();
	}, [images]);

	return (
		<>
			<div className={styles.task_slidein_image_container}>
				{images.map((image: Image) => (
					<ImageDisplay 
						key={image} 
						image={image} 
						deleteHandler={removeImageHandler}
					/>
				))}
			</div>
			<div className={styles.task_slidein_footer}>
				<ImageUploader 
					onChange={addImageHandler} 
					label='Bild hinzufügen'
					path='tasks'
					filename={`${taskName}_${new Date()}.jpg`}
				/>
			</div>
		</>
	);
};

export default TaskImages;