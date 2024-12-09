import React, { useState } from 'react';
import styles from './AddButton.module.scss';
import {VscAdd} from 'react-icons/vsc';
import { AddButton as AddButtonTypes } from '@/types';

const AddButton = ({items}:  AddButtonTypes) => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<>
			<div className={styles.add_button} data-isopen={isOpen} data-iconslength={items.length.toString()}>
				<div className={styles.add_button_container} data-isopen={isOpen} data-iconslength={items.length.toString()}>
					<div className={styles.add_button_icon} data-isopen={isOpen} onClick={() => setIsOpen(!isOpen)}>
						<VscAdd />
					</div>
				</div>
				<div className={styles.icons_container}>
					{items.map(item => (
						<div
							data-isopen={isOpen}
							className={styles.icon}
							key={item.title}
							onClick={item.onClick}
						>
							{item.icon}
						</div>
					))}
				</div>
			</div>
		</>
	);
};

export default AddButton;