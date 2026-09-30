"use client";

import { useEffect, useState } from "react";
import { getImageUrl, useGetData } from "@repo/provider";
import { PatstoreSelectImages } from "@repo/ui";

import { useRichTextEditorContext } from "./RichTextEditor";

function InsertImage() {
	const { editor } = useRichTextEditorContext();
	const [selectedImage, setSelectedImage] = useState("");

	const { data } = useGetData({
		objectName: "Image",
		fields: ["objectId", "file {name url}", "title"],
		id: selectedImage,
		skip: !selectedImage
	});

	useEffect(() => {
		if (!editor || !data?.file?.name) {
			return;
		}

		editor
			.chain()
			.focus()
			.setImage({
				src: getImageUrl({ fileName: data.file.name }),
				alt: data.title || data.objectId
			})
			.run();

		setSelectedImage("");
	}, [data, editor]);

	if (!editor) {
		return null;
	}

	return (
		<PatstoreSelectImages
			image={undefined}
			maxFileCount={1}
			onChange={(imageId: string) => setSelectedImage(imageId)}
		/>
	);
}

export default InsertImage;
