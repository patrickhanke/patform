import { ElementSelectInterface, PersonDisplay } from "@repo/ui";
import { Worker } from "@repo/types";
import React, { useState } from "react";
import { useFindDataSecure } from "@repo/provider";

const SelectUser = () => {
	const { loading, error, data } = useFindDataSecure({
		objectName: "User",
		fields: [
			"objectId",
			"first_name",
			"last_name",
			"is_worker",
			"portrait",
			"color",
			"time_settings",
			"number",
			"data",
			"role { objectId name type color }"
		],
		filters: [{ key: "is_worker", value: true, operator: "equalTo" }],
		order: "last_name_DESC",
		useMasterKey: true
	});
	const [selectedUsers, setSelectedUsers] = useState<Worker[]>([]);

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error.message}</p>;

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
