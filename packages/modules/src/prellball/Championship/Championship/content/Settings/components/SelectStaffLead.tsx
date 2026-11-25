"use client";

import { PatstoreUser } from "@repo/types";
import { ElementSelectInterface, SelectElement, SlideIn } from "@repo/ui";
import { FC, useMemo, useState } from "react";

type SelectStaffLeadProps = {
	users: PatstoreUser[];
	value?: string;
	onChange: (userId: string) => void;
};

const userName = (user: PatstoreUser) =>
	user.name || user.label || user.username || user.email;

const SelectStaffLead: FC<SelectStaffLeadProps> = ({
	users,
	value,
	onChange
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedId, setSelectedId] = useState(value || "");

	const elements: SelectElement[] = useMemo(
		() =>
			users.map((user) => ({
				value: user.objectId,
				id: user.objectId,
				label: userName(user)
			})),
		[users]
	);

	const selectedUser = users.find((user) => user.objectId === value);

	const open = () => {
		setSelectedId(value || "");
		setIsOpen(true);
	};

	return (
		<>
			<button
				type="button"
				className="full_button sm light"
				onClick={open}
			>
				<span>
					{selectedUser
						? userName(selectedUser)
						: "+ Staffelleitung hinzufügen"}
				</span>
			</button>
			<SlideIn
				isOpen={isOpen}
				cancel={() => setIsOpen(false)}
				confirm={() => {
					onChange(selectedId);
					setIsOpen(false);
				}}
				header="Staffelleitung"
			>
				<ElementSelectInterface
					elements={elements}
					selectedElements={elements.filter(
						(element) => element.value === selectedId
					)}
					onSelect={(selected) => {
						const next = selected[0]?.value;
						setSelectedId(next ? String(next) : "");
					}}
					max={1}
					isSearchable
					isClearable
					title="Staffelleitung"
				/>
			</SlideIn>
		</>
	);
};

export default SelectStaffLead;
