"use client";

import { ElementSelectInterface, Modal, SelectElement } from "@repo/ui";
import { useState } from "react";

const SelectReferee = ({
	elements,
	initialSelected,
	onSelect
}: {
	elements: SelectElement[];
	initialSelected: SelectElement | undefined;
	onSelect: (element: SelectElement) => void;
}) => {
	const [refereeModal, setRefereeModal] = useState(false);
	const [selected, setSelected] = useState<SelectElement | undefined>(
		initialSelected ?? undefined
	);
	return (
		<div className="flex col a-st gap-sm">
			<h3>Schiedsrichter</h3>
			<span>{selected?.label || "Kein Schiedsrichter ausgewählt"}</span>
			<button
				className="full_button md dark"
				onClick={() => setRefereeModal(true)}
			>
				Schiedsrichter auswählen
			</button>
			<Modal
				isOpen={refereeModal}
				cancelButtonHandler={() => setRefereeModal(false)}
				confirmButtonHandler={() => selected && onSelect(selected)}
				header="Schiedsrichter"
			>
				<ElementSelectInterface
					elements={elements}
					selectedElements={selected ? [selected] : []}
					onSelect={(elements) => setSelected(elements[0])}
					max={1}
					isSearchable
					isClearable
					title="Schiedsrichter"
				/>
			</Modal>
		</div>
	);
};

export default SelectReferee;
