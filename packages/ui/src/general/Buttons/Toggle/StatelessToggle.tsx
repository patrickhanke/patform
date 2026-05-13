"use client";

import { FC } from "react";
import "./styles.scss";
import { StatelessToggleProps } from "./types";

const StatelessToggle: FC<StatelessToggleProps> = ({
	onChange,
	value,
	disabled = false,
	label
}) => {
	return (
		<div className="toggle-container">
			{label && <label>{label}</label>}
			<div className="toggle-switch" data-disabled={disabled}>
				<input
					readOnly
					type="checkbox"
					checked={value}
					disabled={disabled}
				/>
				<span
					onClick={() => {
						if (disabled) {
							return;
						}
						onChange(!value);
					}}
					className="toggle-slider"
				></span>
			</div>
		</div>
	);
};

export default StatelessToggle;
