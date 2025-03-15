import { useMemo } from "react";
import "./styles.scss";
import { ErrorDisplay } from "@repo/ui";
import {
  UploadDropzone,
  UploadDropzoneConfig,
} from "@bytescale/upload-widget-react";
import { v4 as uuidv4 } from "uuid";
import { ImageUplaoderProps } from "./types";
import clsx from "clsx";
import { getImageUrl } from "@repo/provider";

const ImageUploader = ({
  previewImages,
  onChange,
  label,
  path,
  maxFileCount,
  returnType = "array",
}: ImageUplaoderProps) => {
  const options: UploadDropzoneConfig = useMemo(() => {
    return {
      apiKey: process.env.BYTESCALE_PUBLIC_KEY as string,
      maxFileCount: maxFileCount || 10,
      showFinishButton: false,
      filename: `${path}_${uuidv4()}`,
      path: {
        fileNameFallback: `image_${new Date()}.jpg`,
        fileNameVariablesEnabled: true,
        folderPath: `/patstore/${path}/images`,
        folderPathVariablesEnabled: true,
      },
      showRemoveButton: true,
      styles: {
        buttons: {
          padding: "10px",
          primary: {
            backgroundColor: "#3F9A82",
            color: "#fff",
          },
        },
        colors: {
          primary: "#3F9A82",
          active: "#2d3d38",
        },
      },
    };
  }, []);

  const renderPrevieImages = useMemo(() => {
    if (previewImages && Array.isArray(previewImages)) {
      return (
        <div className="image_uploader_display_container">
          {previewImages.map((image, index) => (
            <img key={index} src={getImageUrl({ filePath: image })} />
          ))}
        </div>
      );
    }
  }, []);

  return (
    <div className={"upload_container"}>
      {label && <label htmlFor="logo">{label}</label>}
      {renderPrevieImages && renderPrevieImages}
      <UploadDropzone
        options={options}
        onUpdate={(files) => {
          if (returnType === "string" && files?.uploadedFiles.length > 0) {
            return onChange(
              files?.uploadedFiles.map((file) => file.filePath)[0] as string,
            ) as unknown as (F: string) => void;
          }
          return onChange(
            files?.uploadedFiles.map((file) => file.filePath),
          ) as unknown as (F: string[]) => void;
        }}
        // onUpdate={files => console.log({files})}
        width="100%"
        height="auto"
        className={clsx("upload_zone", maxFileCount === 1 && "single_image")}
      />
      <ErrorDisplay id="uloader" errors={[]} />
    </div>
  );
};

export default ImageUploader;
