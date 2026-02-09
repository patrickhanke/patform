import { EventDate } from "@repo/types";

const initialDateValues: EventDate = {
	id: "" as string,
	start: "",
	end: "",
	label: "",
	place: {
		type: "map",
		address: "",
		map: { lat: 0, lng: 0 },
		online: ""
	},
	full_day: false
};

export default initialDateValues;
