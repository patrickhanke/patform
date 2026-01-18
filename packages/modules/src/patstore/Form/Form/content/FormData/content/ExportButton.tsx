import { FC } from "react";
import { Button } from "@repo/ui";
import generatePdfExport from "./generatePdfExport";

interface ExportButtonProps {
	title: string;
	data?: { [key: string]: string | undefined } | null;
	date?: string;
	fileName?: string;
	selectedRowsCount: number;
}

const ExportButton: FC<ExportButtonProps> = ({
	title,
	data,
	date,
	fileName = "form-data-export",
	selectedRowsCount
}) => {
	const handleExport = () => {
		if (data) {
			generatePdfExport({ title, data, date, fileName });
		}
	};

	const isDisabled = selectedRowsCount !== 1 || !data;

	return (
		<Button
			text="Als PDF exportieren"
			onClick={handleExport}
			disabled={isDisabled}
		/>
	);
};

export default ExportButton;
