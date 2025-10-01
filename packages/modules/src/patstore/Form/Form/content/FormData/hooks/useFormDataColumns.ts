import { FormDataClass } from "@repo/types";
import { useCreateColumns } from "@repo/ui";
import { ApolloRefetch } from "@repo/provider";
import { isArray } from "lodash-es";
import geneateFormColumns from "../functions/generateFormColumns";

const useFormDataColumns = ({
	data,
	refetch
}: {
	data: FormDataClass["data"];
	refetch: ApolloRefetch;
}) => {
	const columns = useCreateColumns<FormDataClass["data"]>({
		data: [
			{ id: "createdAt", type: "date", label: "Datum" },
			...geneateFormColumns(
				isArray(data)
					? data.map((data) => {
							if (typeof data.data === "string") {
								return data.data;
							} else {
								return JSON.parse(data.data);
							}
						})
					: []
			)
		],
		fields: [],
		className: "Data",
		refetch,
		categories: []
	});

	return columns;
};

export default useFormDataColumns;
