import React from "react";
import { SurchargeOvertimeEditProps } from "../types";

const SurchargeOvertimeEdit: React.FC<SurchargeOvertimeEditProps> = ({
	newSurcharge,
	surchargeChangeHandler
}) => {
	return (
		<>
			<div className="horizontal_container">
				<label htmlFor="value">Wert</label>
				<input
					type="number"
					id="value"
					defaultValue={newSurcharge.data.value}
					onChange={(e) =>
						surchargeChangeHandler("data.value", Number(e.target.value))
					}
				/>
			</div>
		</>
	);
};

export default SurchargeOvertimeEdit;
