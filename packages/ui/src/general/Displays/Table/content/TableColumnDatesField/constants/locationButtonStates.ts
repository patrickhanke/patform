const locationButtonStates: ({
	locationModule
}: {
	locationModule: boolean;
}) => {
	label: string;
	value: string;
	disabled?: boolean;
}[] = ({ locationModule }) => [
	{ label: "Adresse", value: "address" },
	{ label: "Ort", value: "location", disabled: !locationModule },
	{ label: "Karte", value: "map" },
	{ label: "Online", value: "online" }
];

export default locationButtonStates;
