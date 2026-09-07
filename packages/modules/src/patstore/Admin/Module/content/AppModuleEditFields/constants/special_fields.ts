import { ModuleField, ModulePath } from "@repo/types";

const special_fields = (modulePath: ModulePath): ModuleField[] => {
	if (modulePath === "/images") {
		return [
			{
				id: "file",
				label: "Vorschaubild",
				required: false,
				type: "image_preview",
				active: true,
				position: 1,
				default: true,
				hidden: false
			},
			{
				id: "connected_elements",
				label: "Verbundene Elemente",
				required: false,
				type: "connected_elements",
				active: true,
				position: 10,
				default: true,
				hidden: false
			}
		];
	}
	if (modulePath === "/articles") {
		return [
			{
				id: "author",
				label: "Autor",
				required: false,
				type: "edit_person",
				active: true,
				position: 1,
				default: true,
				hidden: false
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
				default: true,
				hidden: false
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
				default: false,
				hidden: false
			},
			{
				id: "persons",
				label: "Personen",
				required: false,
				type: "edit_persons",
				active: false,
				position: 8,
				default: false,
				hidden: false
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
				default: false,
				hidden: false
			},
			{
				id: "address",
				label: "Adresse",
				required: true,
				type: "edit_textfield",
				active: false,
				position: 6,
				default: false,
				hidden: false
			}
		];
	}
	if (modulePath === "/people") {
		return [
			{
				id: "email",
				label: "E-Mail",
				required: false,
				type: "edit_string",
				active: true,
				position: 6,
				default: false,
				hidden: false
			}
		];
	}
	if (modulePath === "/users") {
		return [
			{
				id: "name",
				label: "Name",
				required: false,
				type: "string",
				active: true,
				position: 1,
				default: false,
				hidden: false
			},
			{
				id: "pre_title",
				label: "Titel",
				required: false,
				type: "edit_string",
				active: false,
				position: 1,
				default: false,
				hidden: false
			},
			{
				id: "post_title",
				label: "Post-Titel",
				required: false,
				type: "edit_string",
				active: false,
				position: 1,
				default: false,
				hidden: false
			},
			{
				id: "salutation",
				label: "Anrede",
				required: false,
				type: "edit_string",
				active: false,
				position: 1,
				default: false,
				hidden: false
			},
			{
				id: "first_name",
				label: "Vorname",
				required: false,
				type: "edit_string",
				active: false,
				position: 1,
				default: false,
				hidden: false
			},
			{
				id: "last_name",
				label: "Nachname",
				required: false,
				type: "edit_string",
				active: false,
				position: 1,
				default: false,
				hidden: false
			},
			{
				id: "username",
				label: "Benutzername",
				required: false,
				type: "string",
				active: true,
				position: 2,
				default: true,
				hidden: false
			},
			{
				id: "email",
				label: "E-Mail",
				required: false,
				type: "edit_string",
				active: true,
				position: 3,
				default: true,
				hidden: false
			},
			{
				id: "roles",
				label: "Rolle",
				required: false,
				type: "edit_role",
				active: true,
				position: 4,
				default: true,
				hidden: false
			},
			{
				id: "emails",
				label: "E-Mail-Adressen",
				required: false,
				type: "emails",
				active: false,
				position: 22,
				default: false,
				hidden: false
			},
			{
				id: "expires_at",
				label: "Ablaufdatum",
				required: false,
				type: "date",
				active: false,
				position: 25,
				default: false,
				hidden: false
			}
		];
	}
	if (modulePath === "/videos") {
		return [
			{
				id: "video",
				label: "Video",
				required: false,
				type: "video",
				active: true,
				position: 2,
				default: true,
				hidden: false
			}
		];
	}

	return [];
};

export default special_fields;
