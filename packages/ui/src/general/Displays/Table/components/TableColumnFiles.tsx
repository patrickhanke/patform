"use client";

import { FileObject, FileUploader } from "@repo/ui";

type TableColumnFilesProps = {
	className: "Download" | "Image";
	classKey: string;
	id: string;
	onChange: () => void;
	maxFileCount: number;
	value?: FileObject;
};

const TableColumnFiles = ({
	onChange,
	maxFileCount,
	className,
	classKey,
	id,
	value
}: TableColumnFilesProps) => {
	console.log({ value });

	return (
		<>
			<FileUploader
				key={id}
				type="file"
				className={className}
				classKey={classKey}
				classId={id}
				afterUploadHandler={onChange}
				maxFileCount={maxFileCount}
				existingFile={value}
			/>
		</>
	);
};

export default TableColumnFiles;
