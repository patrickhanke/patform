const HTTP_URL = /^https?:\/\/.+/i;

export type PdfImagePayload = {
	dataUrl: string;
	format: "PNG" | "JPEG" | "WEBP";
};

export const looksLikeHttpUrl = (value: string): boolean => {
	const v = value.trim();
	return v.length > 0 && HTTP_URL.test(v);
};

const blobTypeToFormat = (type: string): PdfImagePayload["format"] | null => {
	if (type.includes("png")) {
		return "PNG";
	}
	if (type.includes("jpeg") || type.includes("jpg")) {
		return "JPEG";
	}
	if (type.includes("webp")) {
		return "WEBP";
	}
	return null;
};

/**
 * Fetches a remote image (CORS must allow the app origin). Returns null on failure or non-image.
 */
export const tryLoadImageForPdf = async (
	url: string
): Promise<PdfImagePayload | null> => {
	const trimmed = url.trim();
	if (!looksLikeHttpUrl(trimmed)) {
		return null;
	}
	try {
		const res = await fetch(trimmed, { mode: "cors" });
		if (!res.ok) {
			return null;
		}
		const blob = await res.blob();
		const type = blob.type || "";
		if (!type.startsWith("image/")) {
			return null;
		}
		if (type.includes("svg")) {
			return null;
		}
		const format = blobTypeToFormat(type);
		if (!format) {
			return null;
		}
		const dataUrl = await new Promise<string>((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = () => reject(new Error("read"));
			reader.readAsDataURL(blob);
		});
		return { dataUrl, format };
	} catch {
		return null;
	}
};

export const preparePdfBodyImages = async (
	rows: string[][]
): Promise<{
	body: string[][];
	imagesByCellKey: Map<string, PdfImagePayload>;
}> => {
	const imagesByCellKey = new Map<string, PdfImagePayload>();

	const body = await Promise.all(
		rows.map(async (row, rowIndex) =>
			Promise.all(
				row.map(async (cell, colIndex) => {
					const trimmed = cell.trim();
					if (!looksLikeHttpUrl(trimmed)) {
						return cell;
					}
					const loaded = await tryLoadImageForPdf(trimmed);
					const key = `${rowIndex}-${colIndex}`;
					if (loaded) {
						imagesByCellKey.set(key, loaded);
						return "";
					}
					return cell;
				})
			)
		)
	);

	return { body, imagesByCellKey };
};
