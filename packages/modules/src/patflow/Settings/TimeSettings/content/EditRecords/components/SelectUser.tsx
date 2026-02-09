import { ElementSelectInterface, PersonDisplay, SelectElement } from "@repo/ui";
import { Worker } from "@repo/types";
import { FC, useMemo } from "react";
import { useFindData } from "@repo/provider";
import { SelectUserProps } from "../types";

const SelectUser: FC<SelectUserProps> = ({ selectedUser, setSelectedUser }) => {
	const { loading, error, data } = useFindData({
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
		filters: [
			{
				key: "is_worker",
				value: true,
				operator: "equalTo"
			}
		],
		order: "last_name_DESC"
	});

	const elements = useMemo(() => {
		const users: Worker[] = data || [];

		if (users) {
			return users.map((user: Worker) => ({
				value: user.objectId,
				label: `${user.first_name} ${user.last_name}`,
				user: user,
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
	}, [data, selectedUser]);

	const selectedElement = useMemo(() => {
		if (selectedUser && elements) {
			const el = elements.find(
				(element) => element.value === selectedUser.objectId
			);
			return [el];
		}
		return [];
	}, [selectedUser, elements]);

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error.message}</p>;

	return (
		<div>
			<ElementSelectInterface
				elements={elements}
				selectedElements={selectedElement as SelectElement[]}
				onSelect={(elements) =>
					setSelectedUser(elements as SelectElement[])
				}
				isSearchable
			/>
		</div>
	);
};

export default SelectUser;
