import { useDataHandler } from "@repo/provider";
import React, { useCallback } from "react";
import CreateDocument from "./components/CreateDocument";
import styles from "./TaskDocuments.module.scss";
import { useQuery } from "@apollo/client";
import TaskDocument from "./components/TaskDocument";
import { GET_TASK_PROPERTY } from "@repo/provider";
import { Document } from "@repo/types";

const TaskDocuments = ({
  taskId,
  refetch,
  documents,
}: {
  taskId: string;
  documents: Document[];
  refetch: () => void;
}) => {
  const { createData } = useDataHandler();
  const { data } = useQuery(GET_TASK_PROPERTY, {
    variables: { id: taskId },
  });

  const addDocumentHandler = useCallback(
    async (content: { user: string; file: Document["file"]; name: string }) => {
      await createData({
        className: "Document",
        updateObject: {
          file: { __type: "File", ...content.file },
          name: content.name,
          created_by: {
            __type: "Pointer",
            className: "_User",
            objectId: content.user,
          },
          object:
            data && data.objects.getTask.property?.objectId
              ? {
                  __type: "Pointer",
                  className: "Property",
                  objectId: data.objects.getTask.object.objectId,
                }
              : null,
          task: {
            __type: "Pointer",
            className: "Task",
            objectId: taskId,
          },
          type: "task",
        },
      });
      refetch();
    },
    [data],
  );

  return (
    <>
      <div className={styles.task_slidein_content_container}>
        {documents.map((document: Document) => (
          <TaskDocument key={document.objectId} document={document} />
        ))}
      </div>
      <div className={styles.task_slidein_footer}>
        <CreateDocument
          addDocumentHandler={addDocumentHandler}
          disabled={!data?.objects?.getTask?.object?.objectId}
        />
      </div>
    </>
  );
};

export default TaskDocuments;
