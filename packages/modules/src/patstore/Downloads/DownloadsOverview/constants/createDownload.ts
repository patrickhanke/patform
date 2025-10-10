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
				min_length: 4,
				max_length: 128
			}
		},
		{
			id: "description",
			position: 3,
			name: "description",
			type: "textarea",
			label: "Infotext"
		}
	]
};

export default createDownload;
