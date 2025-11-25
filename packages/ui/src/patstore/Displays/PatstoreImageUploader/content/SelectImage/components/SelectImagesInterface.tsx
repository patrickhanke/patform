import { FC, useMemo, useState } from "react";
import ImagePagination from "./ImagePagination";
import useFindPatformImages from "../hooks/useFindPatformImages";
import { Filter } from "@repo/types";
import {
	Divider,
	ElementSelectInterface,
	SelectElement,
	TextInput
} from "@repo/ui";
import DisplayImageElement from "./DisplayImageElement";
import { SelectImagesInterfaceProps } from "../types";

const SelectImagesInterface: FC<SelectImagesInterfaceProps> = ({
	selectedImages,
	setSelectedImages,
	moduleId,
	maxFileCount
}) => {
	const [filters, setFilters] = useState<Filter[]>([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 12
	});

	const { images, count } = useFindPatformImages({
		moduleId,
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize
	});

	const elements: SelectElement[] = useMemo(() => {
		const imagesArray: SelectElement[] = [];

		if (images) {
			images.forEach((image) => {
				imagesArray.push({
					value: image.objectId,
					label: image.title,
					element: (
						<DisplayImageElement
							fileName={image?.file?.name}
							name={image?.title}
						/>
					)
				});
			});
		}
		return imagesArray;
	}, [images, images.length]);

	return (
		<div>
			<div>
				<ImagePagination
					pagination={pagination}
					setPagination={setPagination}
					firstPage={() =>
						setPagination({
							pageIndex: 0,
							pageSize: 12
						})
					}
					pageCount={Math.ceil((count || 0) / pagination.pageSize)}
					canGetNextPage={
						pagination.pageIndex <
						Math.ceil((count || 0) / pagination.pageSize) - 1
					}
					canGetPreviousPage={pagination.pageIndex > 0}
					lastPage={() =>
						setPagination((prev) => ({
							...prev,
							pageIndex:
								Math.ceil(
									(images?.length || 0) / pagination.pageSize
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
							id: "title",
							key: "title",
							operator: "_regex",
							value: e
						};
						setFilters([filter]);
					}}
				/>
			</div>
			<Divider size="small" />

			<div className="upload_container">
				<ElementSelectInterface
					elements={elements}
					selectedElements={elements.filter((element) =>
						selectedImages.includes(element.value)
					)}
					onSelect={(selectedElements) => {
						const imageArray: string[] = [];
						selectedElements.forEach((element: SelectElement) => {
							imageArray.push(element.value);
						});
						setSelectedImages(imageArray);
					}}
					useTiles
					// min={1}
					max={maxFileCount}
				/>
			</div>
		</div>
	);
};

export default SelectImagesInterface;
