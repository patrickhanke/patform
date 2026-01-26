const keyTransformer = (formData?: { [key: string]: string | undefined }) => {
	if (!formData) {
		return null;
	}
	const newFormData: { [key: string]: string | undefined } = {};

	Object.keys(formData).forEach((key) => {
		if (key === "address") {
			newFormData["Anrede"] = formData.address;
		}
		if (key === "title") {
			newFormData["Titel"] = formData.title;
		}
		if (key === "first_name") {
			newFormData["Vorname"] = formData.first_name;
		}
		if (key === "last_name") {
			newFormData["Nachname"] = formData.last_name;
		}
		if (key === "email") {
			newFormData["Email"] = formData.email;
		}
		if (key === "phone") {
			newFormData["Telefon"] = formData.phone;
		}
		if (key === "street") {
			newFormData["Straße"] = formData.street;
		}
		if (key === "zip") {
			newFormData["PLZ"] = formData.zip;
		}
		if (key === "city") {
			newFormData["Ort"] = formData.city;
		}
		if (key === "country") {
			newFormData["Land"] = formData.country;
		}
		if (key === "date_of_birth") {
			newFormData["Geburtsdatum"] = formData.date_of_birth;
		}
		if (key === "newsletter") {
			newFormData["Newsletter"] = formData.newsletter ? "Ja" : "Nein";
		}
		if (key === "state_examination") {
			newFormData["Staatsexamen"] = formData.state_examination;
		}
		if (key === "state_examination_location") {
			newFormData["Staatsexamenort"] =
				formData.state_examination_location;
		}
		if (key === "approbation") {
			newFormData["Approbation"] = formData.approbation;
		}
		if (key === "approbation_location") {
			newFormData["Approbationort"] = formData.approbation_location;
		}
		if (key === "promotion") {
			newFormData["Promotion"] = formData.promotion;
		}
		if (key === "promotion_location") {
			newFormData["Promotionort"] = formData.promotion_location;
		}
		if (key === "habitilation") {
			newFormData["Habitation"] = formData.habitilation;
		}
		if (key === "habitilation_location") {
			newFormData["Habitationort"] = formData.habitilation_location;
		}
		if (key === "billing") {
			newFormData["Mitgliedsbeitrag"] = formData.billing;
		}
		if (key === "bill_payment") {
			newFormData["Mitgliedsbeitrag_Zahlungsweise"] =
				formData.bill_payment;
		}
		if (key === "account_owner") {
			newFormData["Kontoinhaber"] = formData.account_owner;
		}
		if (key === "sepa_country") {
			newFormData["SEPA_Land"] = formData.sepa_country;
		}
		if (key === "sepa_iban") {
			newFormData["IBAN"] = formData.sepa_iban;
		}
		if (key === "sepa_bic") {
			newFormData["BIC"] = formData.sepa_bic;
		}
		if (key === "data_protection") {
			newFormData["Datenschutz"] = formData.data_protection;
		}
		if (key === "statue") {
			newFormData["Satzung"] = formData.statue;
		}
	});

	return newFormData;
};

export default keyTransformer;
