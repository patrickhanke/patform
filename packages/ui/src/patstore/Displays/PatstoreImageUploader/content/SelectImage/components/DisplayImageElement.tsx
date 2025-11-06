import { FC } from "react";
import Image from "next/image";
import { getImageUrl } from "@repo/provider";
import { DisplayImageElementProps } from "../types";

const DisplayImageElement: FC<DisplayImageElementProps> = ({
	fileName,
	name
}) => {
	if (!fileName) {
		return null;
	}

	return (
		<div className="flex col ai-st j-fs">
			<Image
				src={getImageUrl({ fileName, width: 256 })}
				width={106}
				height={66}
				style={{ objectFit: "contain" }}
				alt={name || fileName}
			/>
			<h3>{name || fileName}</h3>
		</div>
	);
};

export default DisplayImageElement;
