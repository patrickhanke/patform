import { Absence, Day } from "@repo/types";
import { StateDisplay } from "@repo/ui";
import { absence_type_options } from "@repo/provider";

const ColumnType = ({
	type,
	absenceType
}: {
	type: Day["type"];
	absenceType?: Absence["type"];
}) => {
	if (type === "absence") {
		const aType = [...absence_type_options].find(
			(option) => option.value === absenceType
		);

		if (aType) {
			console.log({ aType });
			return (
				<StateDisplay
					label={aType.label || "-"}
					color={aType.color || "light"}
				/>
			);
		} else return null;
	}
	if (type === "work") {
		return <StateDisplay label={"Arbeitszeit"} color={"green"} />;
	}
	return null;
};

export default ColumnType;
