import { IconButton, Modal, TextInput } from "@repo/ui";
import { FC, useState } from "react";
import { EditTableColumnProps } from "../types";

const EditTableColumn: FC<EditTableColumnProps> = ({ column, onChange }) => {
	const [open, setOpen] = useState(false);
	const [newName, setNewName] = useState(column.name);

	console.log(column.textAlign);
	return (
		<th
			key={column.id}
			style={{ padding: "6px 12px" }}
			className="border-right"
		>
			<div className="flex gap-xs a-ce j-sb w-10">
				<span>{column.name}</span>
				<div className="flex gap-xs">
					<IconButton
						icon="align-left"
						onClick={() => onChange("align", "left")}
						size={16}
						color={
							column.textAlign === "left"
								? "whiteAlpha.900"
								: "default"
						}
					/>
					<IconButton
						icon="align-right"
						onClick={() => onChange("align", "right")}
						size={16}
						color={
							column.textAlign === "right"
								? "whiteAlpha.900"
								: "default"
						}
					/>
					<IconButton
						icon="align-center"
						onClick={() => onChange("align", "center")}
						size={16}
						color={
							column.textAlign === "center"
								? "whiteAlpha.900"
								: "default"
						}
					/>
					<IconButton
						icon="edit"
						onClick={() => setOpen(true)}
						size={16}
					/>
				</div>
			</div>
			<Modal
				isOpen={open}
				confirmButtonHandler={() => {
					onChange("title", newName);
					setOpen(false);
				}}
				cancelButtonHandler={() => setOpen(false)}
				header="Spaltentitle bearbeiten"
			>
				<div>
					<TextInput
						id="name"
						type="text"
						defaultValue={column.name}
						onChange={(value) => setNewName(value)}
					/>
				</div>
			</Modal>
		</th>
	);
};

export default EditTableColumn;
