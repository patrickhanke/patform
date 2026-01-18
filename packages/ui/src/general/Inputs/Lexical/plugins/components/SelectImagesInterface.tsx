import { FC, useState, useMemo } from "react";
import { Filter } from "@repo/types";
import { Divider, ElementSelectInterface, SelectElement, TextInput } from "@repo/ui";

type ImageData = {
	objectId: string;
	title: string;
	label?: string;
	file: {
		url: string;
		name: string;
	};
};

interface SelectImagesInterfaceProps {
	selectedImages: string[];
	setSelectedImages: (images: string[]) => void;
	images: ImageData[];
}

const SelectImagesInterface: FC<SelectImagesInterfaceProps> = ({
	selectedImages,
	setSelectedImages,
	images
}) => {
	const [searchTerm, setSearchTerm] = useState("");

	// Filter images based on search term
	const filteredImages = useMemo(() => {
		if (!searchTerm) return images;
		
		const lowerSearch = searchTerm.toLowerCase();
		return images.filter((image) =>
			image.title?.toLowerCase().includes(lowerSearch) ||
			image.label?.toLowerCase().includes(lowerSearch) ||
			image.file?.name?.toLowerCase().includes(lowerSearch)
		);
	}, [images, searchTerm]);

	const elements: SelectElement[] = useMemo(() => {
		return filteredImages.map((image) => ({
			value: image.objectId,
			label: image.title || image.file?.name || "Untitled",
			element: (
				<div className="image-select-element">
					{image.file?.url && (
						<img
							src={image.file.url}
							alt={image.title || "Image"}
							style={{
								width: "100%",
								height: "150px",
								objectFit: "cover",
								borderRadius: "4px"
							}}
						/>
					)}
					<div style={{ marginTop: "8px", fontSize: "14px" }}>
						{image.title || image.file?.name}
					</div>
				</div>
			)
		}));
	}, [filteredImages]);

	return (
		<div>
			<div className="flex row gap-sm">
				<label>Suche</label>
				<TextInput
					id="search"
					placeholder="Suche nach Bildnamen"
					onChange={(value) => setSearchTerm(value)}
				/>
			</div>
			<Divider size="small" />

			<div className="upload_container">
				<ElementSelectInterface
					elements={elements}
					selectedElements={elements.filter((element) =>
						selectedImages.includes(element.value as string)
					)}
					onSelect={(selectedElements) => {
						const imageArray = selectedElements.map(
							(element: SelectElement) => element.value as string
						);
						setSelectedImages(imageArray);
					}}
					useTiles
				/>
			</div>
		</div>
	);
};

export default SelectImagesInterface;
