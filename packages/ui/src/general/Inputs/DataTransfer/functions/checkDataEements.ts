import { set } from "lodash";
import uploadFromUrl from "./uploadFromUrl";
import { CheckDataElements } from "../types";

const checkDataElement: CheckDataElements = async ({
	dataElement,
	projectPath
}) => {
	console.log(dataElement);
	const dataElementCopy = { ...dataElement };

	const dataElementKeys = Object.keys(dataElement);

	const updateData: Promise<void>[] = [];

	dataElementKeys.forEach(async (key) => {
		if (typeof dataElement[key] === "object") {
			console.log(dataElement[key]);

			if (dataElement[key] !== null && "uuid" in dataElement[key]) {
				console.log("Data element with UUID:", dataElement[key].uuid);
				updateData.push(
					uploadFromUrl({
						accountId: process.env.BYTESCALE_ACCOUNT_ID as string,
						apiKey: process.env.BYTESCALE_SECRET_KEY as string,
						requestBody: {
							url: dataElement[key].cdnUrl
						},
						projectPath
					}).then(
						(response) => {
							console.log(`Success: ${JSON.stringify(response)}`);
							set(dataElementCopy, key, response.filePath);
						},
						(error) => console.error(error)
					)
				);
			} else {
				dataElementCopy[key] = null;
			}
		}
	});

	await Promise.all(updateData);

	console.log("Data Element Copy:", {
		...dataElementCopy
	});

	return {
		...dataElementCopy
	};
};

export default checkDataElement;
