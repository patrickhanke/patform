export type StepsProps = {
	steps: {
		value: string;
		label: string;
		description?: string;
	}[];
	step: number;
	orientation?: "horizontal" | "vertical";
	colorPalette?: "green" | "red" | "blue" | "orange" | "purple";
};
