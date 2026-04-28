import { ElementSelectInterface, PersonDisplay, SelectElement } from "@repo/ui";
import { Worker } from "@repo/types";
import { useState } from "react";
import { useDataStore } from "@repo/provider";

const SelectUser = () => {
	const { workers: data } = useDataStore();
	const [selectedUsers, setSelectedUsers] = useState<SelectElement[]>([]);

	const users: Worker[] = data || [];

	console.log(selectedUsers);

	return (
		<div>
			<ElementSelectInterface
				elements={users.map((user) => ({
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
				}))}
				selectedElements={selectedUsers}
				onSelect={(elements) => setSelectedUsers(elements)}
				isSearchable
			/>
		</div>
	);
};

export default SelectUser;
