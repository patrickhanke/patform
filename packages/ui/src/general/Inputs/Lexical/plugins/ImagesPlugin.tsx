/**
 * Images Plugin - Handle image insertions
 */
import { useEffect, useState, useMemo } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
	$insertNodes,
	COMMAND_PRIORITY_EDITOR,
	createCommand,
	LexicalCommand
} from "lexical";
import { $createImageNode, ImagePayload } from "../nodes/ImageNode";
import { SlideIn } from "@repo/ui";
import SelectImagesInterface from "./components/SelectImagesInterface";
import { useFindData } from "@repo/provider";

export const INSERT_IMAGE_COMMAND: LexicalCommand<ImagePayload> = createCommand(
	"INSERT_IMAGE_COMMAND"
);

export const OPEN_IMAGE_SELECTOR_COMMAND: LexicalCommand<void> = createCommand(
	"OPEN_IMAGE_SELECTOR_COMMAND"
);

type ImageData = {
	objectId: string;
	title: string;
	label?: string;
	file: {
		url: string;
		name: string;
	};
};

export default function ImagesPlugin({ projectId }: { projectId: string }) {
	const [editor] = useLexicalComposerContext();
	const [showImageSelector, setShowImageSelector] = useState(false);
	const [selectedImages, setSelectedImages] = useState<string[]>([]);

	// Fetch all images for the selector
	const { data: images } = useFindData({
		objectName: "Image",
		fields: ["objectId", "title", "label", "file { name url }"],
		order: "createdAt_DESC",
		projectId
	});

	useEffect(() => {
		// Register INSERT_IMAGE_COMMAND
		const unregisterInsert = editor.registerCommand<ImagePayload>(
			INSERT_IMAGE_COMMAND,
			(payload) => {
				const imageNode = $createImageNode(payload);
				$insertNodes([imageNode]);
				return true;
			},
			COMMAND_PRIORITY_EDITOR
		);

	// Register OPEN_IMAGE_SELECTOR_COMMAND
	const unregisterSelector = editor.registerCommand<void>(
		OPEN_IMAGE_SELECTOR_COMMAND,
		() => {
			console.log("OPEN_IMAGE_SELECTOR_COMMAND received");
			setShowImageSelector(true);
			console.log("showImageSelector set to true");
			return true;
		},
		COMMAND_PRIORITY_EDITOR
	);

		return () => {
			unregisterInsert();
			unregisterSelector();
		};
	}, [editor]);

	const handleConfirm = () => {
		if (selectedImages.length > 0 && images) {
			// Insert all selected images into the editor
			editor.update(() => {
				selectedImages.forEach((imageId) => {
					const imageData = images.find(
						(img: ImageData) => img.objectId === imageId
					);
					if (imageData?.file?.url) {
						console.log({ imageData: imageData.file.url });
						console.log({
							imageData: imageData.file.url.replace(/\/$/, "")
						});
						const imageNode = $createImageNode({
							src: imageData.file.url.replace(/\/$/, ""),
							altText:
								imageData.title ||
								imageData.file.name ||
								"Image"
						});
						$insertNodes([imageNode]);
					}
				});
			});
		}
		setShowImageSelector(false);
		setSelectedImages([]);
	};

	const selectImagesContent = useMemo(() => {
		if (!showImageSelector) return null;

		return (
			<SelectImagesInterface
				selectedImages={selectedImages}
				setSelectedImages={setSelectedImages}
				images={images || []}
			/>
		);
	}, [showImageSelector, selectedImages, images]);

	console.log({ showImageSelector });

	return (
		<SlideIn
			key={showImageSelector ? "open" : "closed"}
			header="Bilder auswählen"
			isOpen={showImageSelector}
			cancel={() => {
				setShowImageSelector(false);
				setSelectedImages([]);
			}}
			confirm={handleConfirm}
			secondaryContent={selectImagesContent}
			showSecondaryContent
		>
			<div className="image-selector-preview">
				{selectedImages.length > 0 ? (
					<p>{selectedImages.length} Bild(er) ausgewählt</p>
				) : (
					<p>Keine Bilder ausgewählt</p>
				)}
			</div>
		</SlideIn>
	);
}
