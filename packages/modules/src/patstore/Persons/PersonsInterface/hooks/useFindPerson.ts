import { useFindData } from "@repo/provider";
import { UseFindPersonsHook } from "../types";

const useFindPerson: UseFindPersonsHook = ({ moduleId, filters }) => {
	const { loading, data, refetch } = useFindData({
		objectName: "Person",
		fields: ["objectId", "label", "portrait"],
		moduleId: moduleId
	});
	{
		const { data: filteredData } = useFindData({
			objectName: "Person",
			fields: ["objectId", "label", "portrait"],
			moduleId: moduleId,
			filters: filters,
			skipQuery: !moduleId || filters.length === 0
		});

		return {
			loading,
			filteredData: filteredData ? filteredData : [],
			persons: data ? data : [],
			refetch
		};
	}
};

export default useFindPerson;
