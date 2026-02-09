import { useDataHandler } from "@repo/provider";
import { useCallback } from "react";
import styles from "./TaskImages.module.scss";
import { ImageUploader, ImagesDisplay, ParseImage } from "@repo/ui";

const TaskImages = ({
	taskId,
	refetch,
	images,
	isEditable = true
}: {
	taskId: string;
	images: string[];
	refetch: () => void;
	isEditable?: boolean;
}) => {
	const { updateData } = useDataHandler();
	const addImageHandler = useCallback(
		async (content: ParseImage[]) => {
			console.log({ content });
			const newImages = [
				...images,
				...content.map((image) => image.objectId)
			];

			await updateData({
				className: "Task",
				objectId: taskId,
				updateObject: {
					images: newImages
				}
			});
			refetch();
		},
		[images]
	);

	return (
		<>
			<div className={styles.task_slidein_image_container}>
				<ImagesDisplay images={images} height="180px" />
			</div>
			{isEditable && (
				<div className={styles.task_slidein_footer}>
					<ImageUploader
						onChange={addImageHandler}
						label="Bild hinzufügen"
					/>
				</div>
			)}
		</>
	);
};

export default TaskImages;
