"use client";

import { FileUploader } from "@repo/ui";
import "../styles.scss";

type TableColumnFilesProps = {
  url: string | string[];
  onChange: (files: string[] | string) => void;
  maxFileCount: number;
};

const TableColumnFiles = ({
  url,
  onChange,
  maxFileCount,
}: TableColumnFilesProps) => {
  return (
    <>
      <FileUploader
        type="file"
        label="Bild"
        value={url}
        onChange={(files) => onChange(files)}
        path={`${process.env.BYTESCALE_IMAGE_FOLDER}/files`}
        returnType={maxFileCount === 1 ? "string" : "array"}
        maxFileCount={maxFileCount}
      />
    </>
  );
};

export default TableColumnFiles;
