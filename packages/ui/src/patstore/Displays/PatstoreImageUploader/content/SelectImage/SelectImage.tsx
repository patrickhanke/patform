"use client";

import { FC, useContext, useState } from "react";
import select_states from "./constants/select_states";
import { Divider, FileUploader, SwitchButton, SwitchButtons } from "@repo/ui";
import { SelectImageProps } from "./types";
import { PatstoreAppContext, useAppContext } from "@repo/provider";
import { Module } from "@repo/types";
import SelectImagesInterface from "./components/SelectImagesInterface";

const SelectImage: FC<SelectImageProps> = ({
	maxFileCount,
	selectedImages,
	setSelectedImages,
	loading = false,
	setLoading
}) => {
	const { project, user, userRole } = useContext(PatstoreAppContext);

	const moduleId = project.modules.results.find(
		(module: Module) => module.path === "/images"
	)?.objectId;

	const userHasAccess =
		userRole?.modules?.includes(moduleId) || user.is_superuser;

	const [selectState, setSelectState] = useState<SwitchButton>(
		select_states(loading, userHasAccess)[0]
	);

	const onImageChange = () => {
		setSelectState(select_states(loading, userHasAccess)[0]);
	};

	console.log(userRole);

	console.log(project);
	console.log(user);

	console.log({ userHasAccess });

	return (
		<div className="flex col a-st gap-xs">
			<SwitchButtons
				buttonStates={[...select_states(loading, userHasAccess)]}
				changeHandler={setSelectState}
				currentStates={selectState}
			/>
			<Divider size="small" />
			{selectState.value === "upload" && (
				<FileUploader
					type="image"
					classKey="file"
					className="Image"
					afterUploadHandler={onImageChange}
					maxFileCount={maxFileCount}
					inline
					setLoading={setLoading}
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
