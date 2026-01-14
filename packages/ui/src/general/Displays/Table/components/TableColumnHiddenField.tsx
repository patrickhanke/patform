import { useCallback, useState } from "react";
import { Modal } from "@repo/ui";
import { axiosclient } from "@repo/provider";

const TableColumnHiddenField = ({
	id,
	className,
	field
}: {
	id: string;
	className: string;
	field: string;
}) => {
	const [open, setOpen] = useState(false);
	const [revealed, setRevealed] = useState(false);
	const [hiddenValue, setHiddenValue] = useState<string>("********");

	const getHiddenValue = useCallback(async () => {
		const response = await axiosclient().post(
			"functions/get_hidden_value",
			{
				className,
				id,
				field
			}
		);

		console.log(response);
		setHiddenValue(response.data.result.value);
	}, [id, className, field]);

	return (
		<div>
			<button
				className="full_button sm light"
				onClick={() => setOpen(!open)}
			>
				Anzeigen
			</button>
			<Modal
				isOpen={open}
				cancelButtonHandler={() => {
					setOpen(false);
					setRevealed(false);
				}}
				header={"Objekt bearbeiten"}
				buttonDisabled={[false, false]}
			>
				<div className="flex j-sb gap-sm">
					<div>{hiddenValue}</div>
					<button
						className="full_button sm dark"
						onClick={() => getHiddenValue()}
					>
						{revealed ? "Verbergen" : "Original anzeigen"}
					</button>
				</div>
			</Modal>
		</div>
	);
};

export default TableColumnHiddenField;
