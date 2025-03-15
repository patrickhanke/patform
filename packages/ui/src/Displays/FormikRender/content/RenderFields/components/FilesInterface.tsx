import React, { useCallback, useState } from "react";
import styles from "../RenderFields.module.scss";
import IconButton from "@/_UI/interfaces/IconButton";
import { useDataHandler } from "@repo/provider";
import { FormComponents, FormikRenderTypes } from "@/types/_UI";
import Modal from "@/_UI/interfaces/Modal";

const FilesInterface = ({
  files = [],
  fieldName,
  apiClass,
  id,
  afterSaveHandler,
  setFieldValue,
}: FormComponents.FilesInterfaceComponent) => {
  const { updateData } = useDataHandler(false);
  const [edit, setEdit] = useState([false, ""] as [boolean, string]);
  const [fileName, setFileName] = useState("");

  const deleteFileHandler = useCallback(
    async (file: FormikRenderTypes.DatabaseFile) => {
      const filesCopy = [...files];

      const fileToDelete = filesCopy.findIndex(
        (fileToFind) => fileToFind.url === file.url,
      );
      filesCopy.splice(fileToDelete, 1);

      await updateData({
        className: apiClass,
        objectId: id,
        updateObject: { [fieldName]: filesCopy },
      });
      setFieldValue(fieldName, filesCopy, true);

      if (afterSaveHandler) {
        afterSaveHandler();
      }
    },
    [files],
  );

  if (files) {
    return (
      <div className={styles.files_interface_container}>
        {files.map((file: FormikRenderTypes.DatabaseFile) => (
          <div key={file.url} className={styles.file_interface_element}>
            <a target="__blank" href={file.url}>
              {file.name}
            </a>
            <div className={styles.file_interface_element_buttoncontainer}>
              <IconButton
                onClick={() => deleteFileHandler(file)}
                icon="delete"
              />
              <IconButton
                onClick={() => {
                  setFileName(file.name);
                  setEdit([true, file.url]);
                }}
                icon="edit"
              />
            </div>
            <Modal
              showModal={edit[0]}
              cancelButtonHandler={() => setEdit([false, ""])}
              header="Name ändern"
              confirmButtonHandler={async () => {
                const filesCopy = [...files];
                setEdit([false, ""]);
                const fileToUpdate = filesCopy.findIndex(
                  (fileToFind) => fileToFind.url === file.url,
                );
                filesCopy[fileToUpdate].name = fileName;

                await updateData({
                  className: apiClass,
                  objectId: id,
                  updateObject: { [fieldName]: filesCopy },
                });

                if (afterSaveHandler) {
                  afterSaveHandler();
                }
                setFileName("");
                setEdit([false, ""]);
              }}
            >
              <p>Neuer Dateiname</p>
              <input
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
              />
            </Modal>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default FilesInterface;
