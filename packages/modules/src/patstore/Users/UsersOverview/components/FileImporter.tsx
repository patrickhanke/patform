import { useCallback, useState } from "react";
import Papa from "papaparse";
import { useAppContext } from "@repo/provider";

type ImportedUser = {
	id: string;
	salut: string;
	title: string;
	name: string;
	lname: string;
	login: string;
	passwd: string;
	nlemail: string;
	wp_zip: string;
	wp_city: string;
	wp_country: string;
	retiree: string;
	status: string;
	mitgliedschaft: string;
	perma_url: string;
	ci_perma_url: string;
	newsletter_optin: "1" | "0";
	newsletter_optin_date: "string";
	newsletter_optout_date: string;
	sent: string;
	publish: string;
	mail_status: string;
};

export default function FileImporter() {
	const [data, setData] = useState<ImportedUser[]>([]);
	const { project } = useAppContext();
	const handleFileUpload = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		Papa.parse(file, {
			header: true, // treats first row as headers
			skipEmptyLines: true,
			encoding: "UTF-8",
			complete: (result) => {
				setData(result.data as ImportedUser[]); // result.data is an array of objects
			}
		});
	};

	const uploadUsers = useCallback(async () => {
		const uploadData = data.map((user) => {
			return {
				username: user.nlemail,
				email: user.nlemail,
				name: `${user.name} ${user.lname}`,
				project: {
					__type: "Pointer",
					className: "Project",
					objectId: project.objectId
				},
				is_superuser: false,
				salut: user.salut,
				title: user.title,
				data: {
					accept_search: user.accept_search,
					salut: data.salut,
					title: data.title,
					name: data.name,
					postal_code: data.wp_zip,
					city: data.city,
					country: data.country
				}
			};
		});
		console.log(uploadData);
	}, [data]);

	return (
		<div>
			<input type="file" accept=".csv" onChange={handleFileUpload} />
			<pre>{JSON.stringify(data, null, 2)}</pre>

			<button onClick={() => console.log(Papa.unparse(data))}>
				Upload Users
			</button>
		</div>
	);
}
