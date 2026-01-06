import React, { useCallback, useContext, useEffect, useState } from "react";
import { UplaoderProps } from "../types";
import { useDataHandler, PatstoreAppContext } from "@repo/provider";
import { ErrorMessage } from "@repo/types";
import { Alert, Box, FileUpload, Icon, Input } from "@chakra-ui/react";
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
		if (errors.length > 0) {
			setErrors([]);
		}
		if (setLoading) {
			setLoading(true);
		}

		if (!moduleId) {
			setErrors([
				{
					id: "1",
					key: "moduleId",
					message:
						"Modul ID nicht gefunden, falls dieser Fehler weiterhin auftritt, bitte kontaktieren Sie den Administrator."
				}
			]);
		}

		if (moduleId && files) {
			const images: any[] = [];
			for (const file of files) {
				const fileName: string =
					customFileNames.get(file.name) || file.name;
				try {
					const upload = await createUpdateFile({
						file: file,
						moduleId,
						name: fileName,
						classKey,
						classId,
						className
					});
					images.push(upload);
				} catch (error: any) {
					let errorMessage = "Unbekannter Fehler";

					if (error.code === 122) {
						errorMessage =
							"Diese Datei hat ungültige Zeichen in ihrem Dateinamen (bspw. &, % ...). Bitte benennen Sie die Datei um und versuchen Sie es erneut.";
					}
					if (
						!error.code &&
						error.message.includes("request entity too large")
					) {
						errorMessage =
							"Die Datei ist zu groß. Bitte versuchen Sie es mit einer kleineren Datei.";
					}

					setErrors((prev) => [
						...prev,
						{
							id: `${prev.length + 1}`,
							key: "uploadError",
							message: `${fileName}: ${errorMessage}`
						} as ErrorMessage
					]);
				}
			}
			if (afterUploadHandler) {
				afterUploadHandler(images);
			}
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
		setLoading,
		errors
	]);

	useEffect(() => {
		if (files?.length === 0 && errors.length > 0) {
			setErrors([]);
		}
	}, [files]);

	return (
		<div className={"uppy_upload_container"}>
			<Alert.Root status="info">
				<Alert.Indicator />
				<Alert.Title fontSize="xs">
					Es können nur Dateien bis 5MB und maximal 10 Dateien auf
					einmal hochgeladen werden.
				</Alert.Title>
			</Alert.Root>
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
				disabled={files?.length === 0}
			/>
			<ErrorDisplay errors={errors} />
		</div>
	);
};

export default Uploader;
