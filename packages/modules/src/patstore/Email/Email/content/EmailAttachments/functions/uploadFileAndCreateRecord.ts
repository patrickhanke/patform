import Parse from "parse/dist/parse.min.js";
import Cookies from "js-cookie";

// Initialize Parse if not already initialized
if (!Parse.applicationId) {
	Parse.initialize(
		process.env.NEXT_PUBLIC_SASHIDO_APP_ID || process.env.SASHIDO_APP_ID,
		process.env.NEXT_PUBLIC_SASHIDO_JS_KEY || process.env.SASHIDO_JS_KEY,
		process.env.NEXT_PUBLIC_SASHIDO_MASTER_KEY || process.env.SASHIDO_MASTER_KEY
	);
	Parse.serverURL = process.env.NEXT_PUBLIC_SASHIDO_API_URL || process.env.SASHIDO_API_URL;
}

interface UploadFileParams {
	file: File;
	title: string;
	referenceId: string;
}

export const uploadFileAndCreateRecord = async ({
	file,
	title,
	referenceId
}: UploadFileParams): Promise<string> => {
	try {
		// Helper function to replace special characters
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

		// Sanitize filename
		const fileName = replaceUmlaute(file.name);

		// Upload the file to Parse
		console.log("fileName", fileName);
		console.log("file", file);
		const parseFile = new Parse.File(fileName, file);
		console.log("parseFile", parseFile);
		await parseFile.save(null, {
			sessionToken: Cookies.get("patstore_token")
		});

		// Create a new File object in the database
		const FileObject = new Parse.Object("Document");
		FileObject.set("file", parseFile);
		FileObject.set("title", title);
		FileObject.set("reference_id", referenceId);

		const result = await FileObject.save(null, {
			sessionToken: Cookies.get("patstore_token")
		});

		return result.id || "";
	} catch (error) {
		console.error("Error in uploadFileAndCreateRecord:", error);
		throw error;
	}
};
