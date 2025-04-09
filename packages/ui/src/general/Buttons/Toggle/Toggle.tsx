"use client";

import React, { FC, useCallback } from "react";
import "./styles.scss";
import { ToggleProps } from "./types";
import { useDataHandler } from "@repo/provider";

const Toggle: FC<ToggleProps> = ({
	objectId,
	onClick,
	className,
	key,
	value,
	refetch
}) => {
	const { updateData } = useDataHandler();

	const dataHandler = useCallback(async () => {
		if (onClick) {
			onClick(!value);
			return;
		}

		if (objectId && className && key) {
			await updateData({
				className,
				objectId,
				updateObject: {
					[key]: !value
				}
			});

			if (refetch) {
				refetch();
			}
		}
	}, [value, objectId, className, key, refetch]);

	return (
		<div className="toggle-container" onClick={() => dataHandler()}>
			<div className="toggle-switch">
				<input type="checkbox" checked={value} readOnly />
				<span className="toggle-slider"></span>
			</div>
		</div>
	);
};

export default React.memo(Toggle);
