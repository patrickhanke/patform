import { PageCreateClassObject } from "@repo/ui";
import { DownloadClass } from "@repo/types";

const createDownload: PageCreateClassObject<DownloadClass> = {
	initialData: undefined,
	className: "Download",
	text: "Neuen Download erstellen",
	fields: [
		{
			id: "title",
			position: 1,
			name: "title",
			type: "input",
			label: "Titel",
			validation: {
				required: "Pflichtfeld",
				min_length: 5,
				max_length: 64
			}
		},
		{
			id: "info",
			position: 3,
			name: "info",
			type: "textarea",
			label: "Infotext"
		}
	]
};

export default createDownload;
