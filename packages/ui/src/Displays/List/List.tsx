import React from 'react';
import styles from './List.module.scss';
import { ListType } from '@types';

const List = ({listObject}: ListType) => {
	
	return (
		<div className={styles.list_container}>
			<div className={styles.list_header}>
				{listObject.header.map(headerElement => ( 
					<h3 key={headerElement.key} style={{width: headerElement.width}}>{headerElement.title}</h3> 
				))}
			</div>
			<div className={styles.list_element_container}>
				{listObject.list.map((listElement, index) => ( 
					<div className={styles.list_element} data-islast={index === listObject.list.length - 1} key={listElement.key}>
						{listElement.content.map((content, index) => <div key={content.key} style={{flexBasis: listObject.header[index].width || 300 }}>{content.element}</div>)} 
					</div>
				))}
			</div>
		</div>
	);
};

export default List;