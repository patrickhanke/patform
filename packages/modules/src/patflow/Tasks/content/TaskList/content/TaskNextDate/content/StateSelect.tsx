"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { State, StateSelectProps } from "./types";
import styles from "./StateSelect.module.scss";
import { Icon } from "@repo/ui";
import ReactSelect, { components, StylesConfig } from "react-select";
import customStyles from "./constants/customStyles";

const StateSelect: FC<StateSelectProps> = ({
	type,
	state,
	stateOptions,
	label,
	color,
	icon,
	displayInterface = false,
	stateSelectHandler,
	noBackground = false,
	onClick,
	customOptions,
	width
}) => {
	const [doc, setDoc] = useState<HTMLElement | null>(null);

	const handleStateSelect = (option: State | null) => {
		if (stateSelectHandler && option) {
			stateSelectHandler(option.value);
		}
	};

	const buttonDisabled = useMemo(() => {
		if (onClick) {
			return false;
		}
		if (!displayInterface) {
			return true;
		}
		return false;
	}, [displayInterface, onClick]);

	useEffect(() => {
		const element = document?.body;
		setDoc(element);
	}, []);

	const customComponent = useMemo(() => {
		if (state) {
			return {
				Input: (props: any) => {
					return (
						<components.Input
							{...props}
							style={{ display: "none" }}
						/>
					);
				},
				Option: (props: any) => {
					const option = props.data;
					return (
						<components.Option {...props}>
							<div>{option.label}</div>
						</components.Option>
					);
				},
				SingleValue: (props: any) => {
					const option = props.data;
					return (
						<components.SingleValue {...props}>
							<div
								className={styles.state_display_container}
								data-color={color ? color : option.color}
								data-display_interface={displayInterface}
								data-showicon={!!icon}
								data-no_background={noBackground}
							>
								{icon && <Icon size={10} type={icon} />}
								<span className={styles.state_display_button}>
									{option.label || label}
								</span>
							</div>
						</components.SingleValue>
					);
				}
			};
		}
		return {
			Option: (props: any) => {
				const option = props.data;
				return (
					<div onClick={() => option.onClick()}>
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
									textAlign: state ? "center" : "left",
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
		};
	}, [label, state, icon, displayInterface]);

	const selectValue = useMemo(() => {
		if (customOptions) {
			return customOptions.find((option) => option.label === label);
		}
		if (stateOptions) {
			return stateOptions.find((option) => option.value === state);
		}

		return null;
	}, [state, stateOptions, customOptions, label]);

	return (
		<ReactSelect<State, false>
			value={selectValue}
			options={type === "state" ? stateOptions : customOptions}
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
			onChange={(inputValue) => handleStateSelect(inputValue)}
			isDisabled={buttonDisabled}
		/>
	);
};

export default StateSelect;
