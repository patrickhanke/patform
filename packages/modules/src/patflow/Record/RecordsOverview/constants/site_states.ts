const siteStates = (number: number) =>
	[
		{
			value: "workers",
			label: "Mitarbeiterübersicht"
		},
		{
			value: "weeks",
			label: "Wochenübersicht"
		},
		{
			value: "absence",
			label: `Offene Abwesenheiten (${number})`
		},
		{
			value: "calendar",
			label: "Kalender"
		}
	] as const;

export default siteStates;
