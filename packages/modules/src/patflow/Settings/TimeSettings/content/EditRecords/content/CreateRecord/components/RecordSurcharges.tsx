import React, { useMemo } from "react";
import { RecordSurchargesProps } from "../types";
import { ElementSelectInterface } from "@repo/ui";
import { useDataStore } from "@repo/provider";

const RecordSurcharges: React.FC<RecordSurchargesProps> = ({
	surcharges,
	setSurcharges
}) => {
	const { surcharges: surchargeData } = useDataStore();

	console.log({ surchargeData });

	const elements = useMemo(() => {
		return surchargeData
			.filter((surcharge) => surcharge.active)
			.map((surcharge) => ({
				label: surcharge.name,
				value: surcharge.objectId
			}));
	}, [surchargeData]);

	console.log({ elements });
	console.log(
		elements.filter((surcharge) => surcharges.includes(surcharge.value))
	);

	return (
		<ElementSelectInterface
			elements={elements}
			selectedElements={elements.filter((surcharge) =>
				surcharges.includes(surcharge.value)
			)}
			onSelect={(selectedElements) => {
				setSurcharges(
					selectedElements.map(
						(surcharge) => surcharge.value as string
					)
				);
			}}
		/>
	);
};

export default RecordSurcharges;
