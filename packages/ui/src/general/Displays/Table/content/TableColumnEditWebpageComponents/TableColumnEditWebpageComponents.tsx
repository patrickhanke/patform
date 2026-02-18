import { FC, useState } from "react";
import { EditTable } from "./content";
import { Modal } from "@repo/ui";
import { TableColumnEditWebpageComponentsProps } from "./typed";
import createInitialTableData from "./functions/createInitialTableData";
import { WebpageComponentTable } from "@repo/types";

const TableColumnEditWebpageComponents: FC<
	TableColumnEditWebpageComponentsProps
> = ({ type, initialData, onChange }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [data, setData] = useState<WebpageComponentTable>(
		createInitialTableData(initialData) as WebpageComponentTable
	);

	return (
		<div>
			<button
				className="full_button sm light"
				onClick={() => setIsOpen(true)}
			>
				Bearbeiten
			</button>
			<Modal
				header="Bearbeiten"
				isOpen={isOpen}
				cancelButtonHandler={() => setIsOpen(false)}
				confirmButtonHandler={() => {
					onChange(data);
					setIsOpen(false);
				}}
				buttonDisabled={[false, false]}
			>
				{type === "table" && (
					<EditTable
						initialData={createInitialTableData(initialData)}
						onChange={(tData) => setData(tData)}
					/>
				)}
			</Modal>
		</div>
	);
};

export default TableColumnEditWebpageComponents;
