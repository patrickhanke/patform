import { Loader, Editor } from "@repo/ui";
import { useDataHandler, useGetData } from "@repo/provider";
import React, { useState } from "react";
import { IoDocumentTextOutline } from "react-icons/io5";
import styles from "./TallyDescription.module.scss";

const TallyDescription = ({ tallyId }: { tallyId: string }) => {
  const { updateData } = useDataHandler();

  const [editDescription, setEditDescription] = useState(false);
  const { data, refetch } = useGetData({
    objectName: "Tally",
    fields: ["objectId", "description"],
    id: tallyId
  });

  const descriptionDataHandler = async (value: string) => {
    await updateData({
      className: "Tally",
      objectId: tallyId,
      updateObject: {
        description: value,
      },
    });
    refetch();
  };

  if (data)
    return (
      <div className={styles.description_container}>
        <div className={styles.description_content}>
          <div className={styles.description_header}>
            <IoDocumentTextOutline />
            <label htmlFor="description">Beschreibung</label>
          </div>
          <div className={styles.description_content_text}>
            <Editor
              onChange={descriptionDataHandler}
              content={data.description}
              withToolbar={false}
              onClickOutside={() => {
                if (editDescription) {
                  setEditDescription(false);
                }
              }}
              withPopover
              id="description"
            />
          </div>
        </div>
      </div>
    );
  return <Loader width="100%" height="240px" />;
};

export default TallyDescription;
