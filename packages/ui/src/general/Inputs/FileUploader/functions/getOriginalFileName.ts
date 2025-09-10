import { FileObject } from "../types";

const getOriginalFileName = (file?: FileObject) => {
	if (file && file.name) {
		const arrayName = file.name.split("_");
		let truncatedName: string = "";
		for (let i = 1; i < arrayName.length; i += 1) {
			if (i === arrayName.length - 1) {
				truncatedName += arrayName[i];
			} else {
				truncatedName += arrayName[i] + "_";
			}
		}

		if (truncatedName.length > 30) {
			truncatedName = truncatedName.substring(0, 30) + "...";
		}

		return truncatedName;
	} else {
		return "";
	}
};

export default getOriginalFileName;
