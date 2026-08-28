import { Divider, PatstoreSelectImages, usePageData } from "@repo/ui";
import { FC } from "react";
import { WebpageComponentImage } from "@repo/types";
import { EditImageProps } from "./types";

const createInitialImageData = (
	initialData?: EditImageProps["initialData"]
): WebpageComponentImage => {
	if (initialData && typeof initialData === "object" && "src" in initialData) {
		return {
			src: typeof initialData.src === "string" ? initialData.src : "",
			alt: "alt" in initialData && typeof initialData.alt === "string"
				? initialData.alt
				: "",
			caption:
				"caption" in initialData &&
				typeof initialData.caption === "string"
					? initialData.caption
					: ""
		};
	}

	return { src: "", alt: "", caption: "" };
};

const EditImage: FC<EditImageProps> = ({ initialData, objectId }) => {
	const { data: image, setData } = usePageData<WebpageComponentImage>(
		{ initialData: createInitialImageData(initialData), objectId },
		{
			className: "Content",
			updateObject: (data) => ({ data }),
			message: "Inhalt gespeichert"
		}
	);

	if (!image) return null;

	return (
		<div className="content_element">
			<h3>Bild</h3>
			<Divider size="medium" showLine={false} />
			<div className="flex col gap-md">
				<div>
					<h4>Bild</h4>
					<PatstoreSelectImages
						image={image.src}
						onChange={(value) => {
							const src =
								typeof value === "string" ? value : "";
							setData("src", src);
						}}
						maxFileCount={1}
					/>
				</div>
				<div>
					<h4>Alternativtext</h4>
					<input
						type="text"
						defaultValue={image.alt}
						onChange={(e) => setData("alt", e.target.value, 1000)}
						placeholder="Beschreibung für Screenreader"
					/>
				</div>
				<div>
					<h4>Bildunterschrift</h4>
					<input
						type="text"
						defaultValue={image.caption}
						onChange={(e) =>
							setData("caption", e.target.value, 1000)
						}
						placeholder="Optionale Bildunterschrift"
					/>
				</div>
			</div>
		</div>
	);
};

export default EditImage;
