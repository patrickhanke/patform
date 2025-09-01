"use client";

import { FC, useState } from "react";
import select_states from "./constants/select_states";
import { Divider, FileUploader, SwitchButtons } from "@repo/ui";
import { SelectImageProps } from "./types";
import { useAppContext } from "@repo/provider";
import { Module } from "@repo/types";
import SelectImagesInterface from "./components/SelectImagesInterface";

const SelectImage: FC<SelectImageProps> = ({
	maxFileCount,
	selectedImages,
	setSelectedImages
}) => {
	const { project } = useAppContext();

	const moduleId = project.modules.results.find(
		(module: Module) => module.path === "/images"
	)?.objectId;

	const [selectState, setSelectState] = useState<
		(typeof select_states)[number]
	>(select_states[0]);

	const onImageChange = () => {
		setSelectState(select_states[0]);
	};

	return (
		<div className="flex col a-st gap-xs">
			<SwitchButtons
				buttonStates={[...select_states]}
				changeHandler={setSelectState}
				currentStates={selectState}
			/>
			<Divider size="small" />
			{selectState.value === "upload" && (
				<FileUploader
					type="image"
					classKey="file"
					className="Image"
					onComplete={onImageChange}
					maxFileCount={maxFileCount}
					inline
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
