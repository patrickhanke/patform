import { PageCreateClassObject } from "@repo/ui";
import { LocationClass } from "@repo/types";

const createLocation: PageCreateClassObject<LocationClass> = {
	initialData: undefined,
	className: "Location",
	text: "Neuen Ort erstellen",
	fields: [
		{
			id: "name",
			position: 1,
			name: "name",
			type: "input",
			label: "Name",
			validation: {
				validate: true,
				required: "Pflichtfeld",
				min_length: 5,
				max_length: 90
			}
		},
		{
			id: "image",
			position: 2,
			name: "image",
			type: "image_select",
			label: "Bild",
			options: {
				return_type: "string",
				max_file_count: 1
			}
		},
		{
			id: "description",
			position: 3,
			name: "description",
			type: "textarea",
			label: "Beschreibung"
		},
		{
			id: "address",
			position: 3,
			name: "address",
			type: "textarea",
			label: "Adresse"
		}
	]
};

export default createLocation;
