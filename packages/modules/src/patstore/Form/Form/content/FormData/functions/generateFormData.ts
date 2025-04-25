import { isArray } from "lodash";
import { FormDataClass } from "@repo/types";

const generateFormData: (
	T: FormDataClass["data"]
) => { [key: string]: string }[] = (data) => {
	const dataArray: { [key: string]: string }[] = [];

	if (isArray(data) && data.length > 0) {
		data.forEach((item) => {
			const newItem: { [key: string]: any } = {};
			Object.keys(item).forEach((key) => {
				if (typeof item[key] === "string") {
					newItem[key] = item[key];
				} else if (typeof item[key] === "number") {
					newItem[key] = item[key].toString();
				} else if (
					typeof item[key] === "object" &&
					!isArray(item[key])
				) {
					newItem[key] = JSON.stringify(item[key]);
				} else if (isArray(item[key])) {
					newItem[key] = item[key]
						.map((el: { value: string; label: string }) => el.label)
						.join(", ");
				} else if (typeof item[key] === "boolean") {
					newItem[key] = item[key] ? "Ja" : "Nein";
				} else if (item[key] === null) {
					newItem[key] = "-";
				} else if (item[key] === undefined) {
					newItem[key] = "-";
				}
			});
			dataArray.push(newItem);
		});
	}

	return dataArray;
};

export default generateFormData;
