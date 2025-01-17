import { FC, useCallback } from 'react';
import ListElement from './components/ListElement';
import { ElementSelectInterfaceProps, SelectElement } from './types';
import { cloneDeep } from 'lodash';
import styles from './ElementSelectInterface.module.scss';

const ElementSelectInterface: FC<ElementSelectInterfaceProps> = ({elements=[], selectedElements = [], onSelect, min = 1, max = 1}) => {
	console.log(selectedElements);
    
	const elementChangeHandler = useCallback((element: SelectElement) => {
		const elementsCopy = cloneDeep(selectedElements);
		const isSelected = !!elementsCopy.find((el: SelectElement) => el.value === element.value);
		
		console.log(element);
		console.log(isSelected);
        
		if (isSelected) {
			const newElements = elementsCopy.filter((el: SelectElement) => el.value !== element.value);
			onSelect(newElements);
		}

		if (isSelected === false) {
            
			if (elementsCopy.length < max) {
				elementsCopy.push(element);
				console.log(elementsCopy);
                
				onSelect(elementsCopy);
			}
			if (elementsCopy.length === max) {
				elementsCopy.shift();
				elementsCopy.push(element);
				console.log(elementsCopy);

				onSelect(elementsCopy);
			}
		}
		
	}, [elements, onSelect, selectedElements]);

	return (
		<div className={styles.elements_interface_container}>
			{elements.map((element: SelectElement) => (
				<ListElement
					key={element.value}
					element={element}
					isSelected={selectedElements.some((el: SelectElement) => el.value === element.value)}
					onSelect={elementChangeHandler}


				/>
			))}
		</div>
	);
};

export default ElementSelectInterface;