import { ElementSelectInterface, PersonDisplay, SelectElement } from "@repo/ui";
import { Worker } from "@repo/types";
import { FC, useMemo } from "react";
import { SelectUserProps } from "../types";
import { useDataStore } from "@repo/provider";

const SelectUser: FC<SelectUserProps> = ({ selectedUser, setSelectedUser }) => {
	const { workers } = useDataStore();

	const elements: SelectElement[] = useMemo(() => {
		const users: Worker[] = workers || [];

		if (users) {
			return users.map((user: Worker) => ({
				value: user.objectId,
				label: `${user.first_name} ${user.last_name}`,
				element: (
					<PersonDisplay
						person={{
							label: `${user.first_name} ${user.last_name}`,
							portrait: user.portrait
						}}
					/>
				)
			}));
		}
		return [];
	}, [workers, selectedUser]);

	const selectedElement = useMemo(() => {
		if (selectedUser && elements) {
			const el = elements.find(
				(element) => element.value === selectedUser.objectId
			);
			return [el];
		}
		return [];
	}, [selectedUser, elements]);

	return (
		<div>
			<ElementSelectInterface
				elements={elements}
				selectedElements={selectedElement as SelectElement[]}
				onSelect={(selectedElements) => {
					if (selectedElements.length === 0) {
						return;
					} else if (selectedElements[0]) {
						const user = workers?.find(
							(worker) =>
								worker.objectId === selectedElements[0]?.value
						);

						if (user) {
							setSelectedUser(user);
						}
					}
				}}
				isSearchable
			/>
		</div>
	);
};

export default SelectUser;
