import { Surcharge } from "@repo/types";
import { ColorValues } from "@repo/ui";

const default_surcharge = () => ({
	objectId: "",
	name: "",
	type: "time" as Surcharge["type"],
	time_value: { start: "00:00", end: "00:00" },
	day_value: [],
	work_value: {},
	value: 0,
	active: true,
	start_date: "",
	end_date: null,
	connected_records: [],
	color: "blue" as ColorValues,
	short: "",
	description: ""
});

export default default_surcharge;
