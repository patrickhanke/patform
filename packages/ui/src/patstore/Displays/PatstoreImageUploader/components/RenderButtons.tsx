import { FC } from "react";
import { isArray } from "lodash";
import { generateGraphQLQuery, getImageUrl } from "@repo/provider";
import { useQuery } from "@apollo/client";
import Image from "next/image";
import { RenderButtonsProps } from "../types";

const RenderButtons: FC<RenderButtonsProps> = ({
	selectedImages,
	maxFileCount,
	onClick
}) => {
	console.log("selectedImages", selectedImages);
	
	const { data } = useQuery(
		generateGraphQLQuery({
			type: "get",
			objectName: "Image",
			fields: ["objectId", "filePath", "name"]
		}),
		{
			variables: { id: selectedImages[0] },
			skip: selectedImages.length !== 1 || maxFileCount !== 1
		}
	);

	if (maxFileCount > 1) {
		return (
			<button
				className="full_button sm light"
				type="button"
				onClick={() => onClick()}
			>
				{isArray(selectedImages) ? selectedImages?.length : "0"} Bilder
			</button>
		);
	} else if (maxFileCount === 1 && data) {
		return (
			<div onClick={() => onClick(true)} style={{ cursor: "pointer" }}>
				<Image
					alt={data?.objects.getImage.name}
					src={getImageUrl({
						filePath: data?.objects.getImage.filePath,
						height: 90
					})}
					height={27}
					width={48}
				/>
			</div>
		);
	} else {
		return (
			<button
				className="full_button sm grey"
				onClick={() => onClick(true)}
			>
				+ Bild hinzufügen
			</button>
		);
	}
};

export default RenderButtons;
