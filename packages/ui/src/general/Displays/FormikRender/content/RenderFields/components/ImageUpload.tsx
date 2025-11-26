import React, { ChangeEvent, useEffect, useState } from "react";
import { Box, Button, FileUpload, Image } from "@chakra-ui/react";
import { HiUpload } from "react-icons/hi";
import { useDataHandler } from "@repo/provider";
import ParseFile from "parse/types/ParseFile";

interface ImageUploadProps {
	value?: {
		name: string;
		url: string;
	};
	onChange: (value: ParseFile) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange }) => {
	const { uploadFile } = useDataHandler();
	const [previewUrl, setPreviewUrl] = useState<string>("");
	const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files && files.length > 0) {
			const file: File | null = files[0] || null;

			if (file) {
				// Create preview URL
				const imageUrl = URL.createObjectURL(file);
				setPreviewUrl(imageUrl);

				const uploadedFile = await uploadFile({ file });
				onChange(uploadedFile);
			}
		}
	};

	useEffect(() => {
		if (
			value?.url &&
			typeof value.url === "string" &&
			value.url.startsWith("https://")
		) {
			setPreviewUrl(value.url);
		}
	}, [value]);

	return (
		<div className="flex row a-ce gap-sm">
			<FileUpload.Root accept={["image/*"]} onChange={handleFileChange}>
				<FileUpload.HiddenInput />
				<FileUpload.Trigger asChild>
					<Button variant="outline" size="2xs" scale={0.9}>
						<HiUpload />
						Datei Hochladen
					</Button>
				</FileUpload.Trigger>
			</FileUpload.Root>
			{previewUrl && (
				<Box mt={1} boxSize={"24px"}>
					<Image
						src={previewUrl}
						alt="Preview"
						maxW="24px"
						borderRadius="md"
					/>
				</Box>
			)}
		</div>
	);
};

export default ImageUpload;
