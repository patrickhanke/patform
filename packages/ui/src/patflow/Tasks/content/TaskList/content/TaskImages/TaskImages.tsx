import { useDataHandler } from "@repo/provider";
import React, { useCallback, useContext } from "react";
import styles from "./TaskImages.module.scss";
import { Image } from "@types";
import { ImageUploader, ImagesDisplay } from "@repo/ui";
import { UserContext } from "@provider";

const TaskImages = ({
  taskId,
  taskName,
  refetch,
  images,
}: {
  taskId: string;
  taskName: string;
  images: Image[];
  refetch: () => void;
}) => {
  const { updateData } = useDataHandler();
  const { projectId } = useContext(UserContext);
  const addImageHandler = useCallback(
    async (content: Image[]) => {
      const newImages = [...images, ...content];

      await updateData({
        className: "Task",
        objectId: taskId,
        updateObject: {
          images: newImages,
        },
      });
      refetch();
    },
    [images],
  );

  // const removeImageHandler = useCallback(async (content: Image) => {
  // 	const newImages = [...images];
  // 	newImages.splice(newImages.indexOf(content), 1);

  // 	await updateData({
  // 		className: 'Task',
  // 		objectId: taskId,
  // 		updateObject: {
  // 			images: newImages
  // 		}
  // 	});
  // 	refetch();
  // }, [images]);

  return (
    <>
      <div className={styles.task_slidein_image_container}>
        <ImagesDisplay images={images} />
      </div>
      <div className={styles.task_slidein_footer}>
        <ImageUploader
          onChange={addImageHandler}
          label="Bild hinzufügen"
          path={`/patflow/${projectId}/tasks/${taskId}`}
          filename={`${taskName}_${new Date()}.jpg`}
        />
      </div>
    </>
  );
};

export default TaskImages;
