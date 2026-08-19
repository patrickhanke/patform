import { IconButton, Modal, TextInput } from "@repo/ui";
import { useState } from "react";

const EditTableCell = ({
	name,
	onChange
}: {
	name: string;
	onChange: (name: string) => void;
}) => {
	const [open, setOpen] = useState(false);
	const [newName, setNewName] = useState(name);

	return (
		<td style={{ padding: "6px 12px" }} className="border-right">
			<div className="flex gap-xs a-ce j-sb w-10">
				<span>{name}</span>
				<IconButton
					icon="edit"
					onClick={() => setOpen(true)}
					size={16}
				/>
			</div>
			<Modal
				isOpen={open}
				confirmButtonHandler={() => {
					onChange(newName);
					setOpen(false);
				}}
				cancelButtonHandler={() => setOpen(false)}
				header="Spaltentitle bearbeiten"
			>
				<div>
					<TextInput
						id="name"
						type="text"
						defaultValue={name}
						onChange={(value) => setNewName(value)}
					/>
				</div>
			</Modal>
		</td>
	);
};

export default EditTableCell;
