"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { MenuItemProps, MenuItem as MenuItemType } from "../types";
import Icons from "../constants/Icons";
import "../styles.scss";
import SidebarDivider from "./SidebarDivider";

const MenuItem = ({
	link,
	label,
	icon,
	subMenu = [],
	disabled = false,
	divider
}: MenuItemProps) => {
	const [showSubMenu, setShowSubMenu] = useState(false);
	const pathname = usePathname();

	const path = useMemo(() => {
		let pathString = pathname;
		const sliceIndex = pathname.slice(1).search("/");

		if (sliceIndex !== -1) {
			pathString = pathname.slice(0, sliceIndex + 1);
		}

		return pathString;
	}, [pathname]);

	useEffect(() => {
		if (subMenu.length > 0) {
			subMenu.forEach((subMenuItem: MenuItemType["sub_menu"][number]) => {
				if (pathname.includes(subMenuItem.value)) {
					setShowSubMenu(true);
				}
			});
		}
	}, [pathname, subMenu]);

	const subMenuHandler = (subMenuValue: string, pathname: string) => {
		const sliceIndex = pathname.slice(1).search("/");
		if (sliceIndex !== -1) {
			const pathString = pathname.slice(sliceIndex + 1);
			if (subMenuValue === pathString) {
				return true;
			}
			return false;
		}
		return false;
	};

	return (
		<>
			{divider && <SidebarDivider text={divider} />}
			<li
				data-hassubmenu={subMenu.length > 0}
				style={{
					marginBottom: subMenu.length > 0 && showSubMenu ? 0 : 4.8
				}}
			>
				{subMenu.length > 0 || disabled ? (
					<button
						data-disabled={disabled}
						onClick={() => setShowSubMenu(!showSubMenu)}
						className={clsx(
							link === path
								? ["menu_item", "menu_item_active"]
								: "menu_item"
						)}
					>
						{icon && <Icons icon={icon} />}
						<div className="sidebar_label">{label}</div>
						{!disabled && (
							<div
								className="sidebar_dropicon"
								data-showsubmenu={showSubMenu}
							>
								<IoMdArrowDropdown />
							</div>
						)}
					</button>
				) : (
					<Link
						aria-disabled={disabled}
						as={link}
						className={clsx(
							link === path
								? ["menu_item", "menu_item_active"]
								: "menu_item"
						)}
						href={link}
					>
						{icon && <Icons icon={icon} />}
						<div className={"sidebar_label"}>{label}</div>
					</Link>
				)}
			</li>
			<div className={"submenu_container"} data-showsubmenu={showSubMenu}>
				<ul>
					{subMenu.length > 0 &&
						subMenu.map(
							(subMenuItem: MenuItemType["sub_menu"][number]) => (
								<li
									key={subMenuItem.value}
									className="submenu_item"
									id="submenu_item"
								>
									{!subMenuItem.disabled ? (
										<Link
											className={clsx(
												subMenuHandler(
													subMenuItem.value,
													pathname
												)
													? [
															"menu_item",
															"menu_item_active"
														]
													: "menu_item"
											)}
											href={`${link}${subMenuItem.value}`}
										>
											{icon && (
												<Icons
													icon={subMenuItem.icon}
												/>
											)}
											<div className="sidebar_label">
												{subMenuItem.label}
											</div>
										</Link>
									) : (
										<div
											data-disabled={subMenuItem.disabled}
											className={clsx(
												subMenuHandler(
													subMenuItem.value,
													pathname
												)
													? [
															"menu_item",
															"menu_item_active"
														]
													: "menu_item"
											)}
										>
											{icon && <Icons icon={icon} />}
											<div className="sidebar_label">
												{subMenuItem.label}
											</div>
										</div>
									)}
								</li>
							)
						)}
				</ul>
			</div>
		</>
	);
};

export default MenuItem;
