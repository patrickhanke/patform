import { useContext } from "react";
import {
	useFindData,
	surchargeItemFields,
	surchargeItemFilters,
	UserContext
} from "@repo/provider";
import { Surcharge } from "@repo/types";
import { UseFindSurcharges } from "../types";

const useFindSurcharges: UseFindSurcharges = () => {
	const { projectId } = useContext(UserContext);
	const { data, loading, refetch } = useFindData({
		objectName: "Item",
		fields: surchargeItemFields,
		filters: surchargeItemFilters,
		projectId,
		skipQuery: !projectId
	});

	return {
		loading,
		surcharges: (data || []) as Surcharge[],
		refetch
	};
};

export default useFindSurcharges;
