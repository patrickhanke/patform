'use client';

import { useCallback, useContext, useMemo, useState, useEffect } from 'react';
import { Field, SlideIn } from '@repo/ui';
import { AppContext, useDataHandler } from '@repo/provider';
import { Form } from '@repo/ui';
import { CreateClassProps } from './types';

const CreateClass = ({fields, text, className, refetch}: CreateClassProps) => {
	const {createData}  = useDataHandler();
	const {currentModule} = useContext(AppContext); 
	const [isOpen, setIsOpen] = useState(false);
	const [data, setData] = useState({} as {[key: string]: any});

	const [disabled, setDisabled] = useState<[boolean, boolean]>([false, false]);
   
	const classFields = useMemo(() => {
		const constantFields: Field[] = [...fields];

		if (currentModule.fields) {
			currentModule.fields.forEach(field => {
				if (field.name) {
					constantFields.push({...field, path: '/data'});
				}
			});
		}
		const initialData = {
			title: '',
			image: '',
			text: '',
			autor: '',
			data: currentModule.fields.reduce((acc: {[key: string]: string}, field) => { 
				acc[field.name.slice(field.name.lastIndexOf('.') + 1) as keyof Field] = field.initialValue;
				return acc;
			} , {})
		};

		return {constantFields, initialData};
	}, [currentModule.fields]);

	useEffect(() => {
		if (classFields.initialData && !data) {
			setData(classFields.initialData);
		}
	}, [classFields.initialData]);

	const dataHandler = useCallback(async () => {
		setDisabled([true, true]);
		await createData({
			className: className,
			updateObject: {
				module: {__type: 'Pointer', className: 'Module', objectId: currentModule.objectId},
				...data
			}
		});
		setDisabled([false, false]);
		setIsOpen(false);
		if (refetch) {
			refetch();
		}
	}, [data]);

	return (
		<>
			<button
				onClick={() => setIsOpen(true)}
				disabled={false}
				className='full_button sm primary'
			>
				{text}
			</button>
			<SlideIn 
				isOpen={isOpen} 
				header='News erstellen' 
				cancel={() => setIsOpen(false)} 
				confirm={() => dataHandler()}
				disabled={disabled}
			>
				{classFields.constantFields &&  data && (
					<Form
						fields={classFields.constantFields} 
						data={data} 
						formSubmitHandler={values => {setData( values);}} 
					/>
				)}
			</SlideIn>
		</>
	);
};

export default CreateClass;