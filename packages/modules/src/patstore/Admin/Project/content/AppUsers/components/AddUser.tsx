import { useState, FC, useMemo } from "react";
import { Divider, ElementSelectInterface, TextInput } from "@repo/ui";
import { useFindData } from "@repo/provider";
import { AddUserProps, UserObject } from "../types";
import { PatstoreUser } from "@repo/types";

const AddUser: FC<AddUserProps> = ({ user, setUser, projectId }) => {
	const [searchValue, setSearchValue] = useState("");
	const { data } = useFindData({
		objectName: "_User",
		fields: ["objectId", "username", "email", "label", "projects"],
		filters: [
			{
				key: "username",
				value: searchValue,
				operator: "matchesRegex"
			},
			{
				key: "projects",
				value: projectId,
				operator: "notIn"
			}
		]
	});

	const elements: UserObject[] = useMemo(() => {
		if (data) {
			return data.map((user: PatstoreUser) => {
				return {
					name: user.name,
					role: {
						value: user.role.objectId,
						label: user.role.name
					},
					label: user.label,
					value: user.objectId,
					email: user.username,
					username: user.email,
					projects: user.projects
				} as UserObject;
			});
		}

		return [];
	}, [data]);

	return (
		<div>
			<TextInput
				id="search"
				onChange={(value) => setSearchValue(value)}
				placeholder="Suche nach E-Mail"
			/>
			<Divider size="small" />

			<ElementSelectInterface
				elements={elements}
				onSelect={(value: UserObject[]) => {
					if (value[0]) {
						setUser(value[0]);
					}
				}}
				selectedElements={user ? [user] : []}
			/>
		</div>
	);
};

export default AddUser;
