import React, { useCallback, useContext, useState } from "react";
import { UplaoderProps } from "../types";
import { useDataHandler, PatstoreAppContext } from "@repo/provider";
import { ErrorMessage } from "@repo/types";
import { Box, FileUpload, Icon, Input } from "@chakra-ui/react";
import { LuUpload } from "react-icons/lu";
import { ErrorDisplay, IconButton } from "@repo/ui";
import getAcceptedFiles from "../constants/getAcceptedFiles";

const Uploader: React.FC<UplaoderProps> = ({
	type = "image",
	afterUploadHandler,
	className,
	classKey,
	classId,
	setLoading
}) => {
	const { createUpdateFile } = useDataHandler();
	const { modules } = useContext(PatstoreAppContext);
	const [files, setFiles] = useState<FileList>();
	const [errors, setErrors] = useState<ErrorMessage[]>([]);
	const [customFileNames, setCustomFileNames] = useState<Map<string, string>>(
		new Map()
	);

	const [isUploading, setIsUploading] = useState(false);

	const moduleId = modules.find(
		(module) => module.connected_class === className
	)?.objectId;

	const uploadHandler = useCallback(async () => {
		setIsUploading(true);
		if (setLoading) {
			setLoading(true);
		}
		if (moduleId && files) {
			const uploads = Array.from(files).map((file) => {
				const fileName: string =
					customFileNames.get(file.name) || file.name;
				return createUpdateFile({
					file: file,
					moduleId,
					name: fileName,
					classKey,
					classId,
					className
				});
			});
			const images: any[] = await Promise.all(uploads);

			if (afterUploadHandler) {
				afterUploadHandler(images);
			}
		} else {
			setErrors([
				{
					id: "1",
					key: "moduleId",
					message: "Modul ID nicht gefunden"
				}
			]);
		}
		setIsUploading(false);
		if (setLoading) {
			setLoading(false);
		}
	}, [
		files,
		moduleId,
		customFileNames,
		createUpdateFile,
		classKey,
		classId,
		className,
		afterUploadHandler,
		setLoading
	]);

	return (
		<div className={"uppy_upload_container"}>
			<FileUpload.Root
				accept={getAcceptedFiles(type)}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
					if (e.target.files) {
						setFiles(e.target.files);
					}
				}}
				maxW="xl"
				alignItems="stretch"
				maxFiles={10}
				disabled={isUploading}
			>
				<FileUpload.HiddenInput />
				<FileUpload.Dropzone maxH={180} height={180} minH={180}>
					<Icon size="md" color="fg.muted">
						<LuUpload />
					</Icon>
					<FileUpload.DropzoneContent>
						<Box>Ziehe Dateien hierher</Box>
						<Box color="fg.muted">.png, .jpg bis 5MB</Box>
					</FileUpload.DropzoneContent>
				</FileUpload.Dropzone>
				<FileUpload.ItemGroup>
					<FileUpload.Context>
						{({ acceptedFiles }) =>
							acceptedFiles.map((file) => (
								<FileUpload.Item key={file.name} file={file}>
									{file.type.includes("image") ? (
										<FileUpload.ItemPreviewImage
											width={"100px"}
											height={"60px"}
											borderRadius={"md"}
											objectFit={"cover"}
											alt={file.name}
										/>
									) : (
										<FileUpload.ItemPreview />
									)}
									<Input
										defaultValue={file.name}
										placeholder="Dateiname"
										onChange={(e) => {
											setCustomFileNames((prev) => {
												const newMap = new Map(prev);
												newMap.set(
													file.name,
													e.target.value
												);
												return newMap;
											});
										}}
										width={"180px"}
										minWidth={"180px"}
										disabled={isUploading}
										size="sm"
										flex="1"
									/>
									<FileUpload.ItemSizeText />
									<FileUpload.ItemDeleteTrigger />
								</FileUpload.Item>
							))
						}
					</FileUpload.Context>
				</FileUpload.ItemGroup>
			</FileUpload.Root>
			<IconButton
				icon="upload"
				text="Hochladen"
				onClick={() => uploadHandler()}
				loading={isUploading}
				size={16}
				color="dark"
			/>
			<ErrorDisplay errors={errors} />
		</div>
	);
};

export default Uploader;
