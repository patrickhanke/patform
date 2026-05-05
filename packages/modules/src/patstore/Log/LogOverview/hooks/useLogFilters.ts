import { useMemo } from "react";
import { ModuleFilter } from "@repo/types";

const useLogFilters = () => {
	const filters: ModuleFilter[] = useMemo(() => {
		return [
			{
				field: "class",
				value: "",
				operator: "matchesRegex",
				type: "string",
				id: "class",
				label: "Klasse"
			},
			{
				field: "message",
				value: "",
				operator: "matchesRegex",
				type: "string",
				id: "message",
				label: "Nachricht"
			},
			{
				field: "object_id",
				value: "",
				operator: "matchesRegex",
				type: "string",
				id: "object_id",
				label: "Objekt ID"
			},
			{
				field: "user",
				value: "",
				operator: "matchesRegex",
				type: "string",
				id: "user",
				label: "Nutzer"
			},
			{
				field: "service",
				value: "",
				operator: "matchesRegex",
				type: "string",
				id: "service",
				label: "Service"
			}
		];
	}, []);

	return { filters };
};

export default useLogFilters;
