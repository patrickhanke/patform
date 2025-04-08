"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { State, StateSelectProps } from "./types";
import styles from "./StateSelect.module.scss";
import { Icon } from "@repo/ui";
import ReactSelect, { components, StylesConfig } from "react-select";
import customStyles from "./constants/customStyles";

const StateSelect: FC<StateSelectProps> = ({
	label,
	color,
	icon,
	noBackground = false,
	customOptions = [],
	width
}) => {
	const [doc, setDoc] = useState<HTMLElement | null>(null);

	const handleStateSelect = () => {
		return null;
	};

	useEffect(() => {
		const element = document?.body;
		setDoc(element);
	}, []);

	const customComponent = useMemo(
		() => ({
			Option: (props: any) => {
				const option = props.data;
				return (
					<div
						onClick={() => {
							option.onClick();
						}}
						id={option.value}
					>
						<components.Option {...props}>
							{option.label}
						</components.Option>
					</div>
				);
			},
			Input: (props: any) => {
				return (
					<components.Input {...props} style={{ display: "none" }} />
				);
			},

			Placeholder: (props: any) => {
				return (
					<components.SingleValue {...props}>
						<div
							className={styles.state_display_container}
							data-color={color ? color : ""}
							data-showicon={!!icon}
							data-no_background={noBackground}
						>
							{icon && <Icon size={10} type={icon} />}
							<span style={{ width: "100%", textAlign: "left" }}>
								{label}
							</span>
						</div>
					</components.SingleValue>
				);
			},
			SingleValue: (props: any) => {
				return (
					<components.SingleValue {...props}>
						<div
							className={styles.state_display_container}
							data-color={color ? color : ""}
							data-showicon={!!icon}
							data-no_background={noBackground}
						>
							{icon && <Icon size={10} type={icon} />}
							<span
								style={{
									textAlign: "left",
									whiteSpace: "nowrap",
									overflow: "hidden",
									width: "100%",
									textOverflow: "ellipsis"
								}}
							>
								{label}
							</span>
						</div>
					</components.SingleValue>
				);
			}
		}),
		[label, icon]
	);

	return (
		<ReactSelect<State, false>
			value={customOptions.find((option) => option.label === label)}
			options={customOptions || []}
			menuPortalTarget={doc}
			styles={
				customStyles({ width: width ? width : "auto" }) as StylesConfig<
					State,
					false
				>
			}
			menuPosition="fixed"
			menuPlacement="auto"
			isMulti={false}
			components={customComponent}
			onChange={() => handleStateSelect()}
			isDisabled={false}
		/>
	);
};

export default StateSelect;
