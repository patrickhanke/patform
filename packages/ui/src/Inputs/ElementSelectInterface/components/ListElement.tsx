import { FC } from 'react';
import { ListElementProps } from '../types';
import styles from '../ElementSelectInterface.module.scss';
import clsx from 'clsx';
import { Icon } from '@repo/ui';

const ListElement: FC<ListElementProps> = ({element, isSelected, onSelect}) => {
	
	return (
		<>	
			<div className={clsx('content_element', styles.list_element_container)} data-selected={isSelected} onClick={() => onSelect(element)}>
				<div>
					<Icon type={isSelected ? 'circle-check' : 'circle'} strokeWidth={1.8} color={isSelected ?  'green' : 'gray'} />
				</div>
				{element.element ? element.element : <p>{element.label}</p>}
			</div>
		</>
	);
};

export default ListElement;