import { FilesList, useFileInput } from "@uppy/react";

const FileInput = () => {
	const { getButtonProps, getInputProps } = useFileInput({
		multiple: false,
		accept: "application/*"
	});

	return (
		<div>
			<input {...getInputProps()} className="hidden" />
			<button {...getButtonProps()}>Add files</button>
			<div id="uppy-files-list">
				<FilesList key="files-list" />
			</div>
		</div>
	);
};

export default FileInput;
