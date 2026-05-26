const absence_type_options = [
	{
		value: "illness",
		id: "illness",
		label: "Krankheit",
		color: "red"
	},
	{
		value: "compensation_times",
		id: "compensation_times",
		label: "Ausgleich",
		color: "blue"
	},
	{
		value: "vacation",
		id: "vacation",
		label: "Urlaub",
		color: "yellow"
	},
	{
		value: "payed_absence",
		id: "payed_absence",
		label: "Freistellung",
		color: "orange"
	}
] as const;

export default absence_type_options;
