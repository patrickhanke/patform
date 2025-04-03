"use client";

import React from "react";
import styles from "./SwitchButtons.module.scss";
import { IconButtonTypes, Icons } from "@repo/ui";
import { SwitchButtonProps } from "./types";

const SwitchButtons: React.FC<SwitchButtonProps> = ({
	buttonStates,
	currentStates,
	changeHandler,
	underlineButtons = false,
	useFragment
}) => {
	React.useEffect(() => {
		if (useFragment && window.location.hash) {
			const urlHash = window.location.hash.substring(1);

			const button = buttonStates.find(
				(button) => button.value === urlHash
			);
			if (button && button.value !== currentStates?.value) {
				changeHandler(button);
				window.history.replaceState(null, "", " ");
			}
		}
	}, [useFragment, currentStates, buttonStates]);

	return (
		<div
			className={styles.buttons_container}
			data-underline_buttons={underlineButtons}
		>
			{buttonStates.map((button, index) => (
				<button
					key={button.value.toString()}
					data-isfirst={index === 0}
					data-islast={index + 1 === buttonStates.length}
					data-isactive={currentStates?.value === button.value}
					data-isdisabled={button.disabled === true}
					disabled={button.disabled === true}
					onClick={() => changeHandler(button)}
					style={{ whiteSpace: "nowrap" }}
				>
					{button.is_icon ? (
						<Icons icon={button.label as IconButtonTypes} />
					) : (
						button.label
					)}
				</button>
			))}
		</div>
	);
};

export default SwitchButtons;
