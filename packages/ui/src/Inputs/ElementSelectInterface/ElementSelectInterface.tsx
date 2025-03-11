'use client';

import { FC, Fragment, useCallback, useMemo, useState } from 'react';
import ListElement from './components/ListElement';
import { ElementSelectInterfaceProps, SelectElement } from './types';
import { cloneDeep } from 'lodash-es';
import styles from './ElementSelectInterface.module.scss';
import { Divider } from '../../Layout';

const ElementSelectInterface: FC<ElementSelectInterfaceProps> = ({
	title='',
	elements=[], 
	selectedElements = [], 
	onSelect, 
	min = 1, 
	max = 1, 
	isSearchable=false,
	selectProperty= false
}) => {
	const [searchInput, setSearchTerm] = useState('');

	const elementChangeHandler = useCallback((element: SelectElement) => {
		const elementsCopy = cloneDeep(selectedElements);
		
		if (selectProperty) {
			const elementIndex = elementsCopy.findIndex((el: SelectElement) => el.value === element.value);
			if (elementIndex !== -1) {
				elementsCopy[elementIndex].selected = !elementsCopy[elementIndex].selected;
			}
			onSelect(elementsCopy);
		} else {
			const isSelected = !!elementsCopy.find((el: SelectElement) => el.value === element.value);
			if (isSelected) {
				if (element.single) {
					onSelect([]);
				} else {
					const newElements = elementsCopy.filter((el: SelectElement) => el.value !== element.value);
					onSelect(newElements);
				}
			}
	
			if (isSelected === false) {
				if (element.single) {
					onSelect([element]);
				} else {
					if (elementsCopy.length < max) {
						elementsCopy.push(element);
						
						const newElements = elementsCopy.filter((el: SelectElement) => !el.single);
						onSelect(newElements);
					}
					if (elementsCopy.length === max) {
						elementsCopy.shift();
						elementsCopy.push(element);
						const newElements = elementsCopy.filter((el: SelectElement) => !el.single);

						onSelect(newElements);
					}
				}
			}
		}
		
		
	}, [elements, onSelect, selectedElements]);

	const checkForHeader =  (header: string, index: number, elements: SelectElement[]) => {
		if (!header) {
			return false;
		}
		
		if (header && index === 0)  {
			return true;
		}

		if (header && index > 0) {
			if(elements[index-1].header === header) {
				return false;
			}
		}
		return true;
	}; 

	const filteredElements = useMemo(() => {
		const ele: SelectElement[] = [];
		if (!searchInput) {
			return elements;
		}

		elements.forEach((element: SelectElement) => {
		 	if (Object.values(element).join('').toLowerCase().includes(searchInput.toLowerCase())) {
				ele.push(element);
			}

		});

		return ele;
	}, [elements, selectedElements, searchInput]);

	return (
		<div className={styles.elements_container}>
			{title && 
				<>
					<h3>{title}</h3>
					<Divider showLine={false} />
				</>
			}
			{isSearchable && (
				<div className={styles.filter_container}>
					<input onChange={(e) => setSearchTerm(e.target.value)} placeholder='Suche ...' />
				</div>
			)}
			<div className={styles.elements_interface_container}>
				{filteredElements.map((element: SelectElement, index, elements) => (
					<Fragment key={element.value}>
						{checkForHeader(element.header, index, elements) && <label>{element.header}</label>}
						<ListElement
							key={element.value}
							element={element}
							isSelected={!selectProperty ? selectedElements.some((el: SelectElement) => el.value === element.value) : element.selected}
							onSelect={elementChangeHandler}
						/>
					</Fragment>
				))}
			</div>
		</div>
	);
};

export default ElementSelectInterface;