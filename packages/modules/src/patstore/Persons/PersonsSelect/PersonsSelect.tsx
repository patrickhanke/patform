"use client";

import { useContext, useMemo } from "react";
import { PatstoreAppContext, useFindData } from "@repo/provider";
import { PersonClass } from "@repo/types";
import { PersonOption, PersonSelectProps } from "./types";
import ReactSelect from "react-select";
import customStyles from "./constants/styles";
import { isArray } from "lodash-es";

const PersonsSelect = ({
	persons,
	isMulti = true,
	onChange
}: PersonSelectProps) => {
	const { modules } = useContext(PatstoreAppContext);

	const moduleId = modules.find(
		(module) => module.path === "/persons"
	)?.objectId;
	const { data: personData } = useFindData({
		objectName: "Person",
		fields: ["objectId", "label", "portrait"],
		moduleId: moduleId,
		skipQuery: !moduleId
	});

	const options: PersonOption[] = useMemo(() => {
		const optionsArray: PersonOption[] = [];
		if (personData) {
			personData.forEach((person: PersonClass) => {
				optionsArray.push({
					value: person.objectId,
					label: person.label,
					portrait: person.portrait
				});
			});
		}
		return optionsArray;
	}, [personData, persons]);

	return (
		<ReactSelect
			onChange={(values) =>
				onChange(
					values && isArray(values)
						? values.map((value: PersonOption) => value.value)
						: []
				)
			}
			options={options}
			value={persons.map((personId: string) =>
				options.find((option) => option.value === personId)
			)}
			isMulti={isMulti}
			// components={customComponent}
			styles={customStyles({ width: "100%" })}
			menuPortalTarget={document.body}
			menuPosition="fixed"
			menuPlacement="auto"
		/>
	);
};

export default PersonsSelect;
