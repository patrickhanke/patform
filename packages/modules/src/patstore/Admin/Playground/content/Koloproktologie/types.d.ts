export type ColoproktologenUser = {
	objectId: string;
	address: string;
	title: string;
	first_name: string;
	last_name: string;
	email: string;
	settings: {
		newsletter_email?: string;
		newsletter_optin: boolean;
		newsletter_optin_date: string;
		newsletter_optout_date: string | null;
		publish_specialist: boolean;
	};
	data: {
		klinikposition: string;
		belegklinik: string;
		tel: string;
		fax: string;
		email: string;
	};
};

export type KoloproktologieUser = {
	type: "dgk" | "bcd" | "dgk/bcd";
	username: string;
	first_name: string;
	last_name: string;
	email: string | null;
	title: string;
	address: string;
	password?: string;
	location?: string;
	data: {
		dgk: {
			address: string;
			title: string;
			name: string;
			postal_code: string;
			city: string;
			country: string;
		};
		bcd: {
			fachrichtung: string;
			klinikposition: string;
			belegklinik: string;
			tel: string;
			fax: string;
			email: string;
			country?: string
		};
	};
	settings: {
		bcd: {
			publish_specialist: boolean;
		};
		dgk: {
			accept_search: boolean;
		};
		newsletter_optin?: boolean;
		newsletter_email?: string;
		newsletter_optin_date: string;
		newsletter_optout_date: string | null;
	};
};
