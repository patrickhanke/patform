import German from "@uppy/locales/lib/de_DE";
import Uppy from "@uppy/core";

const createUppyInstance = (type: "file" | "image", maxFileCount: number) =>
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
				type === "file"
					? [
							"image/jpeg",
							"image/jpg",
							"image/png",
							"image/gif",
							"image/webp",
							"image/svg+xml",
							"image/svg",
							"application/pdf",
							"application/x-pdf",
							"application/vnd.ms-excel",
							"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
							"application/vnd.ms-powerpoint",
							"application/vnd.openxmlformats-officedocument.presentationml.presentation",
							"text/plain",
							"text/csv",
							"text/html"
						]
					: [
							"image/jpeg",
							"image/jpg",
							"image/png",
							"image/gif",
							"image/webp"
						],
			maxFileSize: 20000000
		},
		autoProceed: false
	});

export default createUppyInstance;
