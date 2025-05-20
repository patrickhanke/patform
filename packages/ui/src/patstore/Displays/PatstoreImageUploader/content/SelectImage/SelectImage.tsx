"use client";

import { FC, useCallback, useContext, useState } from "react";
import select_states from "./constants/select_states";
import { Divider, SwitchButtons } from "@repo/ui";
import ImageUploader from "./components/ImageUploader";
import { SelectImageProps } from "./types";
import {
	PatstoreAppContext,
	useAppContext,
	useDataHandler
} from "@repo/provider";
import { Module } from "@repo/types";
import { formatISO9075 } from "date-fns";
import SelectImagesInterface from "./components/SelectImagesInterface";

const SelectImage: FC<SelectImageProps> = ({
	maxFileCount,
	selectedImages,
	setSelectedImages
}) => {
	const { project } = useAppContext();

	const { createData } = useDataHandler();
	const { user } = useContext(PatstoreAppContext);

	const moduleId = project.modules.results.find(
		(module: Module) => module.path === "/images"
	)?.objectId;

	const [selectState, setSelectState] = useState<
		(typeof select_states)[number]
	>(select_states[0]);

	const createImageHandler = useCallback(
		async (newImages: { filePath: string; fileName: string }[]) => {
			const uploadArray = newImages.map(async (image) => {
				await createData({
					className: "Image",
					updateObject: {
						name: image.fileName,
						filePath: image.filePath,
						categories: [],
						description: "",
						fields: [],
						connected_elements: [],
						date: formatISO9075(new Date()),
						created_by: {
							__type: "Pointer",
							className: "_User",
							objectId: user.objectId
						},
						module: {
							__type: "Pointer",
							className: "Module",
							objectId: moduleId
						}
					}
				});
			});

			await Promise.all(uploadArray);
			setSelectState(select_states[0]);
		},
		[setSelectState]
	);

	return (
		<div className="flex col al-st gap-xs">
			<SwitchButtons
				buttonStates={[...select_states]}
				changeHandler={setSelectState}
				currentStates={selectState}
			/>
			<Divider size="small" />
			{selectState.value === "upload" && (
				<ImageUploader
					onChange={createImageHandler}
					maxFileCount={maxFileCount}
				/>
			)}
			{moduleId && selectState.value === "select" && (
				<>
					<SelectImagesInterface
						key={selectState.value}
						selectedImages={selectedImages}
						setSelectedImages={setSelectedImages}
						moduleId={moduleId}
						maxFileCount={maxFileCount}
					/>
				</>
			)}
		</div>
	);
};

export default SelectImage;
