import { ElementSelectInterface } from "@repo/ui";
import { SelectFieldsProps } from "../types";
import { FC } from "react";
import table_fields from "../constants/table_fields";

const SelectFields: FC<SelectFieldsProps> = ({ setFields, fields }) => {
	return (
		<ElementSelectInterface<typeof table_fields>
			elements={[...table_fields]}
			selectedElements={table_fields.filter((field) =>
				fields.includes(field.value)
			)}
			onSelect={(elements) =>
				setFields(
					elements.map(
						(element: (typeof table_fields)[number]) =>
							element.value
					)
				)
			}
			max={4}
			selectAll
		/>
	);
};

export default SelectFields;
