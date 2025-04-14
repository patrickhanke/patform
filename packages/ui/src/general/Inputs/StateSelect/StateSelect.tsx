"use client";

import { useEffect, useMemo, useState } from "react";
import { State, StateSelectProps } from "./types";
import styles from "./StateSelect.module.scss";
import { Icon } from "@repo/ui";
import ReactSelect, { components, StylesConfig } from "react-select";
import customStyles from "./constants/customStyles";

const StateSelect = <S extends object | State>({
	state,
	stateOptions,
	label,
	icon,
	isDisabled = false,
	stateSelectHandler,
	noBackground = false,
	customOptions,
	width
}: StateSelectProps<S>) => {
	const [doc, setDoc] = useState<HTMLElement | null>(null);

	const handleStateSelect = (option: S | null) => {
		if (stateSelectHandler && option) {
			stateSelectHandler(option);
		}
	};

	useEffect(() => {
		const element = document?.body;
		setDoc(element);
	}, []);

	const customComponent = useMemo(() => {
		return {
			Input: (props: any) => {
				return (
					<components.Input {...props} style={{ display: "none" }} />
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
							data-color={option.color}
							data-display_interface={true}
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
	}, [label, state, icon]);

	const selectValue = useMemo(() => {
		if (stateOptions) {
			return stateOptions.find((option) => option.value === state);
		}

		return null;
	}, [state, stateOptions, customOptions, label]);

	return (
		<ReactSelect<State, false>
			value={selectValue}
			options={stateOptions}
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
			isDisabled={isDisabled}
		/>
	);
};

export default StateSelect;
