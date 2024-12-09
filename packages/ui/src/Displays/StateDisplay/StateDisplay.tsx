'use client';

import React, { useEffect, useMemo, useState } from 'react';
import useGetState from './hooks/useGetState';
import { Options, StateDisplayComponent } from './types';
import styles from './StateDisplay.module.scss';
import Icon from '../Icon';
import ReactSelect, {components} from 'react-select';
import customStyles from './constants/customStyles';

const StateDisplay = <T extends 'state' | 'no-state'>({
	type, 
	label, 
	state, 
	color, 
	icon, 
	displayInterface=false, 
	stateSelectHandler, 
	noBackground=false, 
	onClick, 
	customOptions,
	width
}: StateDisplayComponent<T>) => {
	const {stateObject, options} = useGetState({type, state});
	const [doc, setDoc] = useState<HTMLElement | null>(null);

	const handleStateSelect = (option: Options<typeof type>[number]) => {
		if (stateSelectHandler) {
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
	});

	const customComponent = useMemo(() => {
		if (state) {
			return ({
				Input: (props: any) => {
					return (
						<components.Input {...props} style={{display: 'none'}} />
					);
				},
				Option: (props: any) => {
					const option = props.data;
					return (
						<components.Option {...props}>
							<div>
								{option.label}
							</div>
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
								{icon && <Icon size={10} type={icon}  />}
								<span className={styles.state_display_button}>{option.label || label}</span>
							</div>
						</components.SingleValue>
					);
				}
			});
		}
		return ({
			Option: (props: any) => {
				const option = props.data;
				return (
					<components.Option {...props}   >
						<div onClick={() => option.onClick()} >{option.label}</div>
					</components.Option>
				);
			},
			Input: (props: any) => {
				return (
					<components.Input {...props}  style={{display: 'none'}} />
				);
			},

			Placeholder: (props: any) => {
				return (
					<components.SingleValue {...props}>
						<div
							className={styles.state_display_container}
							data-color={color ? color : stateObject.color}
							data-showicon={!!icon}
							data-no_background={noBackground}
						>
							{icon && <Icon size={10} type={icon}  />}
							<span style={{width: '100%', textAlign: 'left'}}>{label}</span>
						</div>
					</components.SingleValue>
				);
			},
			SingleValue: (props: any) => {
				return (
					<components.SingleValue {...props}>
						<div
							className={styles.state_display_container}
							data-color={color ? color : stateObject.color}
							data-showicon={!!icon}
							data-no_background={noBackground}
						>
							{icon && <Icon size={10} type={icon}  />}
							<span style={{textAlign: state ? 'center' : 'left', whiteSpace: 'nowrap', overflow: 'hidden', width: '100%',textOverflow: 'ellipsis'}}>{label}</span>
						</div>
					</components.SingleValue>
				);
			}
		});	
	}, [label, state, icon, displayInterface]);

	const selectValue = useMemo(() => {
		if (customOptions) {
			return customOptions.find(option => option.label === label);
		}

		return stateObject;
	}, [stateObject]);

	return (
		<ReactSelect  
			value={selectValue}
			options={state ?  options : customOptions}
			menuPortalTarget={doc}
			styles={customStyles({width: width ? width : 'auto'})}
			menuPosition="fixed"  
			menuPlacement="auto"	
			components={customComponent}
			onChange={(inputValue) => handleStateSelect(inputValue)}
			isDisabled={buttonDisabled}
		/>
	);
};

export default StateDisplay;