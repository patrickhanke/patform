"use client";

import { FileObject, FileUploader } from "@repo/ui";

type TableColumnFileProps = {
	className: "Download" | "Image";
	classKey: string;
	id: string;
	onChange: () => void;
	maxFileCount: number;
	value?: FileObject;
};

const TableColumnFile = ({
	onChange,
	maxFileCount,
	className,
	classKey,
	id,
	value
}: TableColumnFileProps) => {
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

export default TableColumnFile;
