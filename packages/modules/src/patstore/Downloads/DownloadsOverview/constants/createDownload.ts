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
			id: "file",
			position: 2,
			name: "file",
			type: "file",
			label: "Datei",
			options: {
				return_type: "string",
				max_file_count: 1
			},
			validation: {
				validate: true,
				required: "Pflichtfeld"
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
