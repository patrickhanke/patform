import { useMemo } from "react";
import { isArray } from "lodash-es";
import { UseRenderPreviewContentHook } from "../types";
import { getImageUrl } from "@repo/provider";
import FilePreview from "../components/FilePreview";

const useRenderPreviewContent: UseRenderPreviewContentHook = ({
  type,
  value,
}) => {
  const renderPreviewContent = useMemo(() => {
    if (type === "image" && isArray(value)) {
      return (
        <div className="image_uploader_display_container">
          {value.map((image) => (
            <img key={image} src={getImageUrl({ filePath: image })} />
          ))}
        </div>
      );
    } else if (type === "image" && typeof value === "string") {
      return (
        <div className="image_uploader_display_container">
          <img src={getImageUrl({ filePath: value })} />
        </div>
      );
    } else if (type === "file" && isArray(value)) {
      return (
        <div className="file_uploader_display_container">
          {value.map((file, index) => (
            <FilePreview key={file} file={file} number={index + 1} />
          ))}
        </div>
      );
    } else if (type === "file" && typeof value === "string") {
      return <FilePreview file={value} number={1} />;
    } else {
      return null;
    }
  }, []);

  return renderPreviewContent;
};

export default useRenderPreviewContent;
