"use client";

import React, { useMemo } from "react";
import Uppy from "@uppy/core";
import { UppyContextProvider as UContextProvider } from "@uppy/react";
import "@uppy/react/css/style.css";
import German from "@uppy/locales/lib/de_DE";

export const UppyContextProvider: React.FC<{
	children: React.ReactNode;
	maxFileCount: number;
	type: "file" | "image";
}> = ({ children, maxFileCount, type }) => {
	const uppy = useMemo(
		() =>
			new Uppy({
				logger: {
					debug: console.log,
					warn: console.warn,
					error: console.error
				},
				locale: German,
				meta: { type: "avatar" },
				restrictions: {
					maxNumberOfFiles: maxFileCount,
					allowedFileTypes:
						type === "image"
							? [
									"image/jpeg",
									"image/jpg",
									"image/png",
									"image/gif",
									"image/webp",
									"image/svg+xml",
									"image/svg"
								]
							: [
									"application/pdf",
									"application/x-pdf",
									"application/vnd.ms-excel",
									"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
									"application/vnd.ms-powerpoint",
									"application/vnd.openxmlformats-officedocument.presentationml.presentation",
									"text/plain",
									"text/csv",
									"text/html"
								],
					maxFileSize: 20000000
				},
				autoProceed: false
			}),
		[maxFileCount, type]
	);

	return <UContextProvider uppy={uppy}>{children}</UContextProvider>;
};
