import { useQuery } from "@apollo/client";
import { generateGraphQLQuery, getImageUrl } from "@repo/provider";
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
	const { loading, error, data } = useQuery(
		generateGraphQLQuery({
			type: "get",
			objectName: "Image",
			fields: ["objectId", "filePath", "name"]
		}),
		{
			variables: {
				id
			},
			skip: !id || id.length !== 10
		}
	);

	if (id && id.length !== 10) {
		return (
			<Image
				src={getImageUrl({
					filePath: id,
					width: width * 3,
					height: height * 3
				})}
				alt={`${id}`}
				width={width}
				height={height}
			/>
		);
	}

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
		const { filePath, name } = data.objects.getImage;
		return (
			<Image
				src={getImageUrl({
					filePath,
					width: width * 3,
					height: height * 3
				})}
				alt={`${name}`}
				width={width}
				height={height}
			/>
		);
	}

	return null;
};

export default PatstoreImageDisplay;
