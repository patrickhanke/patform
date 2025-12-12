const select_states = (loading: boolean, userHasAccess: boolean) =>
	[
		{
			label: "Bilder auswählen",
			value: "select",
			disabled: loading
		},
		{
			label: "Bilder hochladen",
			value: "upload",
			disabled: loading || !userHasAccess
		}
	] as const;

export default select_states;
