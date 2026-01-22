import { transformToEmail } from "./transformToEmail";
import { ContentBlock } from "../../../ContentEditor";

/**
 * Copy email HTML to clipboard
 */
export const copyEmailHtml = async (
	content: ContentBlock[]
): Promise<boolean> => {
	try {
		const html = transformToEmail(content);
		await navigator.clipboard.writeText(html);
		return true;
	} catch (error) {
		console.error("Failed to copy email HTML:", error);
		return false;
	}
};

/**
 * Download email HTML as file
 */
export const downloadEmailHtml = (
	content: ContentBlock[],
	filename: string = "email-template.html"
): void => {
	const html = transformToEmail(content);
	const blob = new Blob([html], { type: "text/html" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
};
