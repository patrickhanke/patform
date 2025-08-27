"use client";

import { FileUploader } from "@repo/ui";

type TableColumnFilesProps = {
	className: "Download" | "Image";
	classKey: string;
	id: string;
	onChange: () => void;
	maxFileCount: number;
	fileNumber: number;
};

const TableColumnFiles = ({
	onChange,
	maxFileCount,
	className,
	classKey,
	id,
	fileNumber
}: TableColumnFilesProps) => {
	console.log({ fileNumber });

	return (
		<>
			<FileUploader
				type="file"
				className={className}
				classKey={classKey}
				classId={id}
				afterUploadHandler={onChange}
				maxFileCount={maxFileCount}
				existingFiles={fileNumber}
			/>
		</>
	);
};

export default TableColumnFiles;
