"use client";

import React, { useCallback, useMemo, useState } from "react";
import "./styles.scss";
import { ErrorDisplay, IconButton, InfoBox } from "@repo/ui";
import { ErrorMessage } from "@repo/types";
import { useAppContext, Parse } from "@repo/provider";
import { Alert, Box, FileUpload, Icon, Input } from "@chakra-ui/react";
import { LuUpload } from "react-icons/lu";
import Cookies from "js-cookie";

export type ParseImage = {
	objectId: string;
	title: string;
	file: {
		name: string;
		url: string;
	};
};

type ImageUploaderProps = {
	previewImages?: ParseImage[];
	onChange: (images: ParseImage[]) => void | Promise<void>;
	label: string;
	maxFileCount?: number;
	deleteHandler?: (image: ParseImage) => void;
	setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
	userId?: string;
};

const ImageUploader: React.FC<ImageUploaderProps> = ({
	previewImages,
	onChange,
	label,
	maxFileCount = 10,
	deleteHandler,
	setLoading,
	userId
}) => {
	const { project } = useAppContext();
	const [files, setFiles] = useState<FileList>();
	const [errors, setErrors] = useState<ErrorMessage[]>([]);
	const [customFileNames, setCustomFileNames] = useState<Map<string, string>>(
		new Map()
	);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadSuccess, setUploadSuccess] = useState(false);
	const [uploadSuccessCounter, setUploadSuccessCounter] = useState(0);

	const replaceUmlaute = (fileName: string): string => {
		return fileName
			.replace(/ä/g, "ae")
			.replace(/Ä/g, "Ae")
			.replace(/ö/g, "oe")
			.replace(/Ö/g, "Oe")
			.replace(/ü/g, "ue")
			.replace(/Ü/g, "Ue")
			.replace(/ß/g, "ss")
			.replace(/\(/g, "")
			.replace(/\)/g, "");
	};

	const uploadHandler = useCallback(async () => {
		setIsUploading(true);
		if (errors.length > 0) {
			setErrors([]);
		}
		if (setLoading) {
			setLoading(true);
		}

		if (files) {
			const uploadedImages: ParseImage[] = [];

			for (const file of files) {
				const title = customFileNames.get(file.name) || file.name;
				const fileName = replaceUmlaute(file.name);
				try {
					// Upload file to Parse
					const parseFile = new Parse.File(fileName, file);
					await parseFile.save();

					// Create Image object with file and title
					const imageObject = new Parse.Object("Image");
					imageObject.set("file", parseFile);
					imageObject.set("title", title);
					if (userId) {
						imageObject.set("created_by", {
							__type: "Pointer",
							className: "_User",
							objectId: userId
						});
					}

					if (project?.objectId) {
						imageObject.set("project", {
							__type: "Pointer",
							className: "Project",
							objectId: project.objectId
						});
					}
					const sessionToken = Cookies.get(
						process.env.SESSION_TOKEN as string
					);

					if (!sessionToken) {
						throw new Error("Session token not found");
					}
					const savedImage = await imageObject.save(null, {
						sessionToken: Cookies.get(sessionToken)
					});

					uploadedImages.push({
						objectId: savedImage.id || "",
						title: title,
						file: {
							name: parseFile.name() || fileName,
							url: parseFile.url() || ""
						}
					});
				} catch (error: unknown) {
					let errorMessage = "Unbekannter Fehler";
					const parseError = error as {
						code?: number;
						message?: string;
					};

					if (parseError.code === 122) {
						errorMessage =
							"Diese Datei hat ungültige Zeichen in ihrem Dateinamen (bspw. &, % ...). Bitte benennen Sie die Datei um und versuchen Sie es erneut.";
					}
					if (
						!parseError.code &&
						parseError.message?.includes("request entity too large")
					) {
						errorMessage =
							"Die Datei ist zu groß. Bitte versuchen Sie es mit einer kleineren Datei.";
					}

					setErrors((prev) => [
						...prev,
						{
							id: `${prev.length + 1}`,
							key: "uploadError",
							message: `${title}: ${errorMessage}`
						} as ErrorMessage
					]);
				}
			}

			if (uploadedImages.length > 0) {
				onChange(uploadedImages);
				setUploadSuccess(true);
			}
		}

		setIsUploading(false);
		if (setLoading) {
			setLoading(false);
		}
		setFiles(undefined);
		setCustomFileNames(new Map());
	}, [files, customFileNames, onChange, setLoading, errors, userId, project]);

	const previewContent = useMemo(() => {
		if (!previewImages || previewImages.length === 0) return null;

		return (
			<div className="image_uploader_display_container">
				{previewImages.map((image) => (
					<div
						key={image.objectId}
						className="content_element image_preview_item"
					>
						<img
							src={image.file.url}
							alt={image.title}
							style={{
								maxHeight: "60px",
								borderRadius: "4px",
								objectFit: "cover"
							}}
						/>
						<span style={{ fontSize: "12px" }}>{image.title}</span>
						<div className="delete_button_container">
							{deleteHandler && (
								<IconButton
									icon="delete"
									onClick={() => deleteHandler(image)}
									size={6}
								/>
							)}
						</div>
					</div>
				))}
			</div>
		);
	}, [previewImages, deleteHandler]);

	return (
		<div className="upload_container">
			<label htmlFor="imageUploader">{label}</label>
			{previewContent}
			<Alert.Root status="info">
				<Alert.Indicator />
				<Alert.Title fontSize="xs">
					Es können nur Bilder bis 5MB und maximal {maxFileCount}{" "}
					Bilder auf einmal hochgeladen werden.
				</Alert.Title>
			</Alert.Root>
			<FileUpload.Root
				key={`upload-${uploadSuccessCounter}`}
				accept={["image/*"]}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
					if (e.target.files) {
						setUploadSuccess(false);
						setFiles(e.target.files);
					}
				}}
				maxW="xl"
				alignItems="stretch"
				maxFiles={maxFileCount}
				disabled={isUploading}
			>
				<FileUpload.HiddenInput />
				<FileUpload.Dropzone maxH={180} height={180} minH={180}>
					<Icon size="md" color="fg.muted">
						<LuUpload />
					</Icon>
					<FileUpload.DropzoneContent>
						<Box>Ziehe Bilder hierher</Box>
						<Box color="fg.muted">
							.png, .jpg, .gif, .webp bis 5MB
						</Box>
					</FileUpload.DropzoneContent>
				</FileUpload.Dropzone>
				<FileUpload.ItemGroup>
					{uploadSuccess ? (
						<InfoBox
							status="success"
							text="Alle Dateien erfolgreich hochgeladen"
						/>
					) : (
						<FileUpload.Context>
							{({ acceptedFiles }) =>
								acceptedFiles.map((file) => (
									<FileUpload.Item
										key={file.name}
										file={file}
									>
										<FileUpload.ItemPreviewImage
											width="100px"
											height="60px"
											borderRadius="md"
											objectFit="cover"
											alt={file.name}
										/>
										<Input
											defaultValue={file.name}
											placeholder="Bildtitel"
											onChange={(e) => {
												setCustomFileNames((prev) => {
													const newMap = new Map(
														prev
													);
													newMap.set(
														file.name,
														e.target.value
													);
													return newMap;
												});
											}}
											width="180px"
											minWidth="180px"
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
					)}
				</FileUpload.ItemGroup>
			</FileUpload.Root>
			<IconButton
				icon="upload"
				text="Hochladen"
				onClick={() => uploadHandler()}
				loading={isUploading}
				size={16}
				color="dark"
				disabled={!files || files.length === 0}
			/>
			<ErrorDisplay errors={errors} />
		</div>
	);
};

export default ImageUploader;
