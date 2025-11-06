const select_states = (loading: boolean) =>
	[
		{
			label: "Bilder auswählen",
			value: "select",
			disabled: loading
		},
		{
			label: "Bilder hochladen",
			value: "upload",
			disabled: loading
		}
	] as const;

export default select_states;
