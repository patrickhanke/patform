import { getImageUrl, useGetData } from "@repo/provider";
import { Loader } from "@repo/ui";
import { SquareX } from "lucide-react";
import Image from "next/image";
import { PatstoreImageDisplayProps } from "./types";
import { FC } from "react";

const PatstoreImageDisplay: FC<PatstoreImageDisplayProps> = ({
	id,
	height,
	width
}) => {
	const { loading, error, data } = useGetData({
		objectName: "Image",
		fields: ["objectId", "file {name url}", "title"],
		id: id
	});

	if (loading) {
		return (
			<div style={{ height, width }}>
				<Loader width={`${width}px`} height={`${height}px`} />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex a-ce j-ce" style={{ height, width }}>
				<SquareX />
			</div>
		);
	}

	if (data) {
		const { file, name } = data.objects.getImage;
		return (
			<Image
				src={getImageUrl({
					fileName: file?.name,
					width: width * 3,
					height: height * 3
				})}
				alt={`${name}`}
				width={width}
				height={height}
				style={{ objectFit: "cover" }}
				unoptimized
			/>
		);
	}

	return null;
};

export default PatstoreImageDisplay;
