import { Surcharge } from "@repo/types";
import { ColorValues } from "@repo/ui";
import { SURCHARGE_REFERENCE_ID } from "@repo/provider";

const default_surcharge = (): Surcharge => ({
	objectId: "",
	title: "",
	label: "",
	date: "",
	description: "",
	reference_id: SURCHARGE_REFERENCE_ID,
	data: {
		kind: "surcharge",
		type: "time",
		time_value: { start: "00:00", end: "00:00" },
		day_value: [],
		work_value: {},
		value: 0,
		active: true,
		start_date: "",
		end_date: null,
		color: "blue" as ColorValues,
		short: ""
	}
});

export default default_surcharge;
