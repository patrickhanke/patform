import React, { Dispatch, SetStateAction } from "react";

export type SwitchButton = {
	value: string | number | boolean;
	label: string;
	disabled?: boolean;
	is_icon?: boolean;
};

export type SwitchButtonProps = {
	buttonStates: Array<SwitchButton>;
	currentStates: SwitchButton;
	changeHandler: Dispatch<SetStateAction<SiteState>>;
	underlineButtons?: boolean;
	useFragment?: boolean;
	showBottomLine?: boolean;
};
