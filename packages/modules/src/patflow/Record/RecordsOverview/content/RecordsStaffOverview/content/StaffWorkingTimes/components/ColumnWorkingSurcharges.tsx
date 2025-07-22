import { useCallback } from "react";
import { Day, Surcharge } from "@repo/types";
import { StateDisplay } from "@repo/ui";
import { convertMillisecondsToString } from "@repo/provider";

const ColumnWorkingSurcharges = ({
	surcharges,
	daySurcharges
}: {
	surcharges: Surcharge[];
	daySurcharges: Day["surcharges"];
}) => {
	const findSurcharge = useCallback(
		(surchargeId: string) => {
			return surcharges.find(
				(surcharge) => surcharge.objectId === surchargeId
			);
		},
		[surcharges]
	);

	return (
		<div className="button_container">
			{daySurcharges.map((sh) => {
				const surcharge = findSurcharge(sh.surcharge_id);
				if (!surcharge || !sh.saldo || sh.saldo === 0) {
					return null;
				}

				return (
					<div key={surcharge.objectId}>
						<StateDisplay
							color={surcharge.color}
							label={`${surcharge.short} (${convertMillisecondsToString(sh.saldo)})`}
						/>
					</div>
				);
			})}
		</div>
	);
};

export default ColumnWorkingSurcharges;
