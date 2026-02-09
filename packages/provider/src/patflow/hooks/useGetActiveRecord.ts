import { Record } from "@repo/types";
import { useFindData } from "@repo/provider";
import { useMemo } from "react";

type Props = {
	year: number;
	userId: string;
};

type ReturnObject = {
	record: Record | null;
	loading: boolean;
};

const useGetActiveRecord: { (T: Props): ReturnObject } = ({ year, userId }) => {
	const { data: recordData, loading } = useFindData({
		objectName: "Record",
		fields: ["objectId", "year", "user"],
		filters: [
			{ key: "year", operator: "equalTo", value: year },
			{ key: "user", operator: "equalTo", value: userId }
		]
	});

	const data: ReturnObject = useMemo(
		() => ({
			record: recordData ? recordData[0] : null,
			loading
		}),
		[recordData, loading]
	);

	return data;
};

export default useGetActiveRecord;
