import { generateImagePath } from "@repo/provider";
import { UploadFromUrl } from "../types";

const uploadFromUrl: UploadFromUrl = async ({
	accountId,
	apiKey,
	requestBody,
	projectPath
}) => {
	if (!accountId) throw new Error("Missing accountId");
	if (!apiKey) throw new Error("Missing apiKey");
	if (!projectPath) throw new Error("Missing projectPath");
	const subPath = generateImagePath(
		process.env.APP_NAME as string,
		projectPath
	);
	const baseUrl = "https://api.bytescale.com";

	const path = `/v2/accounts/${accountId}/uploads/url`;

	const entries = (obj: object) =>
		Object.entries(obj).filter(([, val]) => (val ?? null) !== null);

	const response = await fetch(`${baseUrl}${path}`, {
		method: "POST",
		body: JSON.stringify(requestBody),
		headers: Object.fromEntries(
			entries({
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json"
			}) as string[][]
		)
	});
	const result = await response.json();
	let filePath: string = result.filePath;
	console.log(result);

	if (result) {
		const fileName = result.filePath.split("/").pop();
		const copyBody = {
			destination: `${subPath}/${fileName}`,
			source: result.filePath
		};

		const copyResponse = await fetch(
			`${baseUrl}/v2/accounts/${accountId}/files/copy`,
			{
				method: "POST",
				body: JSON.stringify(copyBody),
				headers: Object.fromEntries(
					entries({
						Authorization: `Bearer ${apiKey}`,
						"Content-Type": "application/json"
					}) as string[][]
				)
			}
		);

		if (copyResponse.ok) {
			console.log({copyResponse});
			
			filePath = copyBody.destination;
		}
		console.log(copyResponse);
	}

	if (Math.floor(response.status / 100) !== 2)
		throw new Error(`Bytescale API Error: ${JSON.stringify(result)}`);
	return { result, filePath };
};

export default uploadFromUrl;
