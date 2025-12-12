import { Divider, SwitchButton, SwitchButtons } from "@repo/ui";
import { useState, FC, useEffect } from "react";
import table_states from "./constants/table_states";
import { EditTableProps } from "./types";
import EditTableColumns from "./components/EditTableColumns";
import EditTableRows from "./components/EditTableRows";
import EditTableSettings from "./components/EditTableSettings";
import "./styles.scss";

const EditTable: FC<EditTableProps> = ({ initialData, onChange }) => {
	const [table, setTable] = useState(initialData);
	const [activeTab, setActiveTab] = useState<SwitchButton>(table_states[0]);

	useEffect(() => {
		if (onChange) onChange(table);
	}, [table]);

	return (
		<div className="table_edit_container">
			<SwitchButtons
				buttonStates={[...table_states]}
				changeHandler={setActiveTab}
				currentStates={activeTab}
			/>
			<Divider showLine />

			{activeTab.value === "settings" && (
				<EditTableSettings table={table} onChange={setTable} />
			)}

			{activeTab.value === "columns" && (
				<EditTableColumns table={table} setTable={setTable} />
			)}

			{activeTab.value === "rows" && (
				<EditTableRows table={table} onChange={setTable} />
			)}
		</div>
	);
};

export default EditTable;
