import { generateImagePath, useDataHandler } from "@repo/provider";
import { useCallback, useContext } from "react";
import styles from "./TaskImages.module.scss";
import { Image } from "@repo/types";
import { ImageUploader, ImagesDisplay } from "@repo/ui";
import { UserContext } from "@repo/provider";

const TaskImages = ({
	taskId,
	taskName,
	refetch,
	images
}: {
	taskId: string;
	taskName: string;
	images: Image[];
	refetch: () => void;
}) => {
	const { updateData } = useDataHandler();
	const { project } = useContext(UserContext);
	const addImageHandler = useCallback(
		async (content: Image[]) => {
			const newImages = [...images, ...content];

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
				<ImagesDisplay images={images} />
			</div>
			<div className={styles.task_slidein_footer}>
				<ImageUploader
					onChange={addImageHandler}
					label="Bild hinzufügen"
					path={generateImagePath(
						process.env.APP_NAME as string,
						project.path
					)}
					filename={`${taskName}_${new Date()}.jpg`}
				/>
			</div>
		</>
	);
};

export default TaskImages;
