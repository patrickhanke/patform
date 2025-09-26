const getAcceptedFiles = (type: "image" | "file") => {
	if (type === "image") {
		return ".png, .jpg";
	} else if (type === "file") {
		return ".pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt, .csv, .ods, .odt, .rtf, .xml, .json, .zip, .rar, .7z, .gz, .tar, .tgz, .bz2, .xz";
	}
};

export default getAcceptedFiles;
