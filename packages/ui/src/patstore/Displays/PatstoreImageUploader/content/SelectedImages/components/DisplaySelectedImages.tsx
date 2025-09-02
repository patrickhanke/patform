import { FC } from "react";
import "../styles.scss";
import { DisplaySelectedImagesProps } from "../types";
import Image from "next/image";
import { IconButton } from "@repo/ui";
import { getImageUrl } from "@repo/provider";

const DisplaySelectedImages: FC<DisplaySelectedImagesProps> = ({
	id,
	image,
	name,
	maxFileCount,
	removeImageHandler
}) => {
	if (!image) {
		return <p>Bild nicht gefunden</p>;
	}

	return (
		<div
			className="selected_image_container"
			data-hasfullwidth={maxFileCount === 1}
		>
			<Image
				src={getImageUrl({ fileName: image?.name, width: 1024 })}
				alt={name}
				width={maxFileCount === 1 ? 360 : 120}
				height={maxFileCount === 1 ? 202.5 : 63}
				style={{ objectFit: "contain" }}
				fill={false}
			/>
			<div className="selected_image_icons">
				{removeImageHandler && (
					<IconButton
						icon={"delete"}
						onClick={() => removeImageHandler(id)}
					/>
				)}
			</div>
			<h4>{name} </h4>
		</div>
	);
};

export default DisplaySelectedImages;
