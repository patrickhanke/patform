import { Divider, TableColumnVideo, usePageData } from "@repo/ui";
import { FC } from "react";
import { WebpageComponentVideo } from "@repo/types";
import { EditVideoProps } from "./types";

const createInitialVideoData = (
	initialData?: EditVideoProps["initialData"]
): WebpageComponentVideo => {
	if (
		initialData &&
		typeof initialData === "object" &&
		"src" in initialData &&
		typeof initialData.src === "string"
	) {
		return { src: initialData.src };
	}

	return { src: "" };
};

const EditVideo: FC<EditVideoProps> = ({ initialData, objectId }) => {
	const { data: video, setData } = usePageData<WebpageComponentVideo>(
		{ initialData: createInitialVideoData(initialData), objectId },
		{
			className: "Content",
			updateObject: (data) => ({ data }),
			message: "Inhalt gespeichert"
		}
	);

	if (!video) return null;

	return (
		<div className="content_element">
			<h3>Video</h3>
			<Divider size="medium" showLine={false} />
			<TableColumnVideo
				value={video.src}
				onChange={(filePath) => setData("src", filePath)}
				id={objectId}
			/>
		</div>
	);
};

export default EditVideo;
