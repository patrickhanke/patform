"use client";

import {
	FC,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState
} from "react";
import select_states from "./constants/select_states";
import {
	Divider,
	ElementSelectInterface,
	SelectElement,
	SwitchButtons,
	TextInput
} from "@repo/ui";
import ImageUploader from "./components/ImageUploader";
import { SelectImageProps } from "./types";
import useGetImages from "./hooks/useGetImages";
import {
	PatstoreAppContext,
	useAppContext,
	useDataHandler
} from "@repo/provider";
import { Filter, Module } from "@repo/types";
import DisplayImageElement from "./components/DisplayImageElement";
import ImagePagination from "./components/ImagePagination";

const SelectImage: FC<SelectImageProps> = ({
	maxFileCount,
	selectedImages,
	setSelectedImages
}) => {
	const { createData } = useDataHandler();
	const { project } = useAppContext();
	const { user } = useContext(PatstoreAppContext);
	const [filters, setFilters] = useState<Filter[]>([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	});

	const [selectState, setSelectState] = useState<
		(typeof select_states)[number]
	>(select_states[0]);

	const moduleId = project.modules.results.find(
		(module: Module) => module.path === "/images"
	)?.objectId;

	const {
		images,
		refetch: imagesRefetch,
		count
	} = useGetImages({
		moduleId,
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize
	});

	useEffect(() => {
		if (selectState.value === "select") {
			imagesRefetch();
		}
	}, [selectState]);

	const createImageHandler = useCallback(
		async (images: { filePath: string; fileName: string }[]) => {
			const uploadArray = images.map(async (image) => {
				await createData({
					className: "Image",
					updateObject: {
						name: image.fileName,
						filePath: image.filePath,
						categories: [],
						description: "",
						fields: [],
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
			// await imagesRefetch();
		},
		[moduleId, imagesRefetch]
	);

	const elements: SelectElement[] = useMemo(() => {
		const imagesArray: SelectElement[] = [];

		if (!images) {
			return imagesArray;
		}
		images.forEach((image) => {
			imagesArray.push({
				value: image.objectId,
				label: image.name,
				element: (
					<DisplayImageElement
						filePath={image.filePath}
						name={image.name}
					/>
				)
			});
		});
		return imagesArray;
	}, [images]);

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
					<div>
						<ImagePagination
							pagination={pagination}
							setPagination={setPagination}
							firstPage={() =>
								setPagination({
									pageIndex: 0,
									pageSize: 10
								})
							}
							pageCount={Math.ceil(
								(count || 0) / pagination.pageSize
							)}
							canGetNextPage={
								pagination.pageIndex <
								Math.ceil((count || 0) / pagination.pageSize) -
									1
							}
							canGetPreviousPage={pagination.pageIndex > 0}
							lastPage={() =>
								setPagination((prev) => ({
									...prev,
									pageIndex:
										Math.ceil(
											(images?.length || 0) /
												pagination.pageSize
										) - 1
								}))
							}
							nextPage={() =>
								setPagination((prev) => ({
									...prev,
									pageIndex: prev.pageIndex + 1
								}))
							}
							previousPage={() =>
								setPagination((prev) => ({
									...prev,
									pageIndex: prev.pageIndex - 1
								}))
							}
							pageIndex={pagination.pageIndex}
						/>
					</div>
					<Divider size="small" />
					<div className="flex row gap-sm">
						<label>Suche</label>
						<TextInput
							id="search"
							placeholder="Suche nach Bildnamen"
							onChange={(e) => {
								const filter: Filter = {
									id: "name",
									key: "name",
									operator: "_regex",
									value: e
								};
								setFilters([filter]);
							}}
						/>
					</div>
					<Divider size="small" />

					<div className="upload_container">
						{images && (
							<ElementSelectInterface
								elements={elements}
								selectedElements={elements.filter((element) =>
									selectedImages.includes(element.value)
								)}
								onSelect={(selectedElements) => {
									const imageArray: string[] = [];
									selectedElements.forEach(
										(element: SelectElement) => {
											imageArray.push(element.value);
										}
									);
									setSelectedImages(imageArray);
								}}
								useTiles
							/>
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default SelectImage;
