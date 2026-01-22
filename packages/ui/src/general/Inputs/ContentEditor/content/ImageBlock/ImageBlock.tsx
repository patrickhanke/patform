"use client";

import { ContentBlock } from "../../ContentEditor";
import "./styles.scss";
import { useGetData } from "@repo/provider";

interface ImageBlockProps {
	block: ContentBlock;
	onUpdate: (updates: Partial<ContentBlock>) => void;
}

export default function ImageBlock({ block, onUpdate }: ImageBlockProps) {
	const { data: image } = useGetData({
		objectName: "Image",
		fields: ["objectId", "file {name url}", "title"],
		id: block.value,
		skip: !block.value
	});
	const alignment = block.config?.alignment || "center";
	const imageUrl = block.config?.imageUrl || "";
	const imageAlt = block.config?.imageAlt || "Image";
	console.log({ block });

	return (
		<div className={`image-block alignment-${alignment}`}>
			{image ? (
				<img
					src={image.file?.url}
					alt={image.title || image.objectId}
					className="image-block-img"
					width={block.config?.width || "100%"}
					height={block.config?.height || "auto"}
					style={{
						width: block.config?.width || "100%",
						height: block.config?.height || "auto"
					}}
				/>
			) : (
				<div className="image-block-placeholder">
					<div className="placeholder-icon">🖼</div>
					<p>No image selected</p>
					<p className="placeholder-hint">
						Set image URL in properties
					</p>
				</div>
			)}
		</div>
	);
}
