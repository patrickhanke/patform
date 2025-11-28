import { ModuleField } from "@repo/types";

const special_fields = (modulePath: string): ModuleField[] => {
	if (modulePath === "/images") {
		return [
			{
				id: "file",
				label: "Vorschaubild",
				required: false,
				type: "image_preview",
				active: true,
				position: 1,
				default: true
			},
			{
				id: "connected_elements",
				label: "Verbundene Elemente",
				required: false,
				type: "connected_elements",
				active: true,
				position: 10,
				default: true
			}
		];
	}
	if (modulePath === "/arcticles") {
		return [
			{
				id: "author",
				label: "Autor",
				required: false,
				type: "edit_person",
				active: true,
				position: 1,
				default: true
			}
		];
	}
	if (modulePath === "/events") {
		return [
			{
				id: "location",
				label: "Ort",
				required: false,
				type: "location",
				active: true,
				position: 1,
				default: true
			}
		];
	}
	if (modulePath === "/groups") {
		return [
			{
				id: "team",
				label: "Team",
				required: false,
				type: "edit_team",
				active: false,
				position: 8,
				default: false
			},
			{
				id: "persons",
				label: "Personen",
				required: false,
				type: "edit_persons",
				active: false,
				position: 8,
				default: false
			}
		];
	}
	if (modulePath === "/locations") {
		return [
			{
				id: "coordinates",
				label: "Ort",
				required: false,
				type: "edit_geopoint",
				active: true,
				position: 6,
				default: false
			},
			{
				id: "address",
				label: "Adresse",
				required: true,
				type: "adit_textfield",
				active: false,
				position: 6,
				default: false
			}
		];
	}
	if (modulePath === "/persons") {
		return [
			{
				id: "email",
				label: "E-Mail",
				required: false,
				type: "edit_string",
				active: true,
				position: 6,
				default: false
			}
		];
	}
	if (modulePath === "/users") {
		return [
			{
				id: "label",
				label: "Name",
				required: true,
				type: "edit_string",
				active: true,
				position: 1,
				default: true
			},
			{
				id: "username",
				label: "Benutzername",
				required: false,
				type: "string",
				active: true,
				position: 2,
				default: true
			},
			{
				id: "email",
				label: "E-Mail",
				required: false,
				type: "edit_string",
				active: true,
				position: 3,
				default: true
			},
			{
				id: "roles",
				label: "Rolle",
				required: false,
				type: "edit_role",
				active: true,
				position: 4,
				default: true
			}
		];
	}

	return [];
};

export default special_fields;
