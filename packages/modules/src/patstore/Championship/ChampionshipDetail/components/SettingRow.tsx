"use client";

import { FC, ReactNode } from "react";

const SettingRow: FC<{
	label: string;
	description?: string;
	children: ReactNode;
}> = ({ label, description, children }) => (
	<div className="flex row a-ce j-sb gap-sm">
		<div className="flex col a-st">
			<label>{label}</label>
			{description ? <p>{description}</p> : null}
		</div>
		{children}
	</div>
);

export default SettingRow;
