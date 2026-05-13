const absence_type_options = [
	{
		value: "illness",
		id: "illness",
		label: "Krankheit",
		color: "red"
	},
	{
		value: "compensation_times",
		label: "Ausgleich",
		title: "Ausgleichszeiten",
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
		label: "Freistellung",
		title: "Bezahlte Freistellung",
		color: "orange"
	}
] as const;

export default absence_type_options;
