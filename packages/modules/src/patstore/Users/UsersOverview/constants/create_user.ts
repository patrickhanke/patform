import { CreateUser } from "../types";
import create_user_fields from "./create_user_fields";

const create_user = (roles: { value: string; label: string }[]): CreateUser => {
	return {
		EgRR0prozh: {
			fields: create_user_fields(roles, true),
			data: {
				data: {
					dgk: {
						address: "",
						title: "",
						name: "",
						postal_code: "",
						city: "",
						country: ""
					},
					bcd: {
						klinikposition: "",
						fachrichtung: "",
						belegklinik: "",
						tel: "",
						fax: "",
						email: "",
						location: ""
					},
					type: "bcd"
				},
				settings: {
					dgk: {
						accept_search: false
					},
					bcd: {
						publish_specialist: false
					},
					newsletter_optin: false,
					newsletter_email: "",
					newsletter_optin_date: "",
					newsletter_optout_date: ""
				}
			}
		}
	};
};

export default create_user;
