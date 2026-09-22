import { useMemo } from "react";

const useSiteStates = () => {
	const siteStates = useMemo(() => {
		const siteStateArray = [
			{
				value: "tasks",
				label: "Aufgaben"
			},
			{
				value: "tickets",
				label: "Tickets"
			}
		];

		return siteStateArray;
	}, []);

	return siteStates;
};

export default useSiteStates;
