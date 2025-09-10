import { PatflowUser, PatstoreUser } from "@repo/types";
import React from "react";

export type SidebarProps = {
	menuItems: MenuItem[];
	user?: PatstoreUser | PatflowUser;
	children?: React.ReactNode;
	appVersion?: string;
	appName?: string;
};

export type MenuItem = Readonly<{
	value: string;
	label: string;
	icon?: string;
	disabled?: boolean;
	divider?: string;
	sub_menu: {
		value: string;
		label: string;
		icon: string;
		disabled?: boolean;
	}[];
}>;

export type MenuItemProps = {
	link: string;
	label: string;
	icon?: string;
	subMenu: MenuItem["sub_menu"];
	disabled?: boolean;
	divider?: string;
};
