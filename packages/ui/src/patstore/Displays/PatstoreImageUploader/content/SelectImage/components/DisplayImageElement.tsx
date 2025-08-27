import { FC } from "react";
import Image from "next/image";
import { getImageUrl, getImageUrlFromBytescale } from "@repo/provider";
import { DisplayImageElementProps } from "../types";

const DisplayImageElement: FC<DisplayImageElementProps> = ({
	fileName,
	name
}) => {
	return (
		<div className="flex col ai-st j-fs">
			<Image
				src={getImageUrl({ fileName, width: 256 })}
				width={106}
				height={66}
				style={{ objectFit: "contain" }}
				alt={name}
			/>
			<h3>{name}</h3>
		</div>
	);
};

export default DisplayImageElement;
