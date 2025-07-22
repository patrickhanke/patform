const absence_type_options = [
	{
		value: "vacation",
		label: "Urlaub",
		title: "Urlaub"
	},
	{
		value: "compensation_times",
		label: "Ausgleich",
		title: "Ausgleichszeiten"
	},
	{
		value: "illness",
		label: "Krankheit",
		title: "Krankheit"
	},
	{
		value: "payed_absence",
		label: "Freistellung",
		title: "Bezahlte Freistellung"
	}
] as const;

export default absence_type_options;
