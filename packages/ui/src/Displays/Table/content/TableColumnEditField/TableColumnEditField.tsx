'use client';

import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { IconButton, SlideIn } from '@repo/ui';
import { AppContext, generateGraphQLQuery, useDataHandler } from '@repo/provider';
import { Form } from '@repo/ui';
import { TableColumnEditFieldComponent, TableColumnEditFieldProps } from './types';
import { Classes } from '@repo/types';
import { get } from 'lodash';

const TableColumnEditField: TableColumnEditFieldComponent = <Class extends Classes>({objectId, className}: TableColumnEditFieldProps) => {
	const {updateData}  = useDataHandler();
	const {currentModule} = useContext(AppContext); 
	const [data, setData] = useState(null as unknown as Class['data']);
	const [isOpen, setIsOpen] = useState(false);
	const [secondaryContent, setSecondaryContent] = useState<React.ReactNode>(null);
	const { loading, refetch } = useQuery(generateGraphQLQuery({
		type: 'get', 
		objectName: className, 
		fields: ['objectId', 'data'] 
	} ), {
		variables: { id: objectId },
		onCompleted: response => {  
			const newData = get( response, `objects.get${className}.data`, null);
			setData(newData);
		},
		skip: !isOpen
	});
	const [disabled, setDisabled] = useState<[boolean, boolean]>([false, false]);
   
	const dataHandler = useCallback(async () => {
		setDisabled([true, true]);
		await updateData({
			objectId: objectId,
			className,
			updateObject: {
				data
			}

		});
		setDisabled([false, false]);
		setIsOpen(false);

	}, [data]);

	useEffect(() => {
		if (isOpen) {
			refetch();
		}
	}, [isOpen]);

	return (
		<>
			<IconButton
				icon='edit'
				onClick={() => setIsOpen(true)}
				disabled={loading}
			/>
			<SlideIn 
				isOpen={isOpen} 
				header='Objekt bearbeiten' 
				cancel={() => setIsOpen(false)} 
				confirm={() => dataHandler()}
				disabled={disabled}
				showSecondaryContent={!!secondaryContent}
				secondaryContent={secondaryContent}
			>
				{currentModule.fields && (
					<Form 
						fields={currentModule.fields} 
						data={data} 
						formSubmitHandler={values => setData(values)} 
						setSecondaryContent={setSecondaryContent}
					/>
				)}
			</SlideIn>
		</>
	);
};

export default TableColumnEditField;