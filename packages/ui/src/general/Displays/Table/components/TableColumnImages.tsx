import { PatstoreSelectImages, TableColumnImagesProps } from "@repo/ui";

const TableColumnImages = ({
	value,
	onChange,
	maxFileCount
}: TableColumnImagesProps) => {
	console.log(value);
	
	return (
		<div>
			<PatstoreSelectImages
				image={value}
				onChange={onChange}
				maxFileCount={maxFileCount || 1}
			/>
		</div>
	);
};

export default TableColumnImages;
