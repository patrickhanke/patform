import { useState } from "react";
import type { LogData } from "@repo/types";
import { IconButton, Modal } from "@repo/ui";

const LogData = ({ data }: { data: LogData }) => {
	const [open, setOpen] = useState(false);

	const hasData = Object.keys(data).length > 0;

	if (!hasData) return <p>Keine Daten</p>;

	return (
		<div>
			<IconButton
				icon="view"
				onClick={() => setOpen(!open)}
				text="Daten anzeigen"
			/>
			<Modal
				header="Daten"
				isOpen={open}
				cancelButtonHandler={() => setOpen(false)}
			>
				<pre>{JSON.stringify(data, null, 2)}</pre>
			</Modal>
		</div>
	);
};

export default LogData;
