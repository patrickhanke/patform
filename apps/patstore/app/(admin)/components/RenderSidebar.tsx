"use client";

import Link from "next/link";
import Logo from "./Logo";
import { MenuItem, Sidebar } from "@repo/ui";

const RenderSidebar = ({ menuItems }: { menuItems: MenuItem[] }) => {
	return (
		<div className={"layout_sidebar_container"} id="sidebar">
			<Link href={"/"}>
				<div className={"layout_sidebar_header"}>
					<Logo />
				</div>
			</Link>
			<Sidebar menuItems={menuItems} />
		</div>
	);
};

export default RenderSidebar;
