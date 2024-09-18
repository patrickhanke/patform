'use client';

import { useCallback, useContext, useState } from 'react';
import { SlideIn } from '@repo/ui';
import { AppContext, useDataHandler } from '@repo/provider';
import { Form } from '@repo/ui';
import { Classes } from '@repo/types';
import { CreateClassProps } from './types';

const CreateClass = <T extends Classes>({initialData, fields, className, refetch}: CreateClassProps<T>) => {
	const {createData}  = useDataHandler();
	const {currentModule} = useContext(AppContext); 
	const [isOpen, setIsOpen] = useState(false);
	const [data, setData] = useState<T['data']>(initialData || {} as {[key: string]: any});

	const [disabled, setDisabled] = useState<[boolean, boolean]>([false, false]);
   
	const dataHandler = useCallback(async () => {
		setDisabled([true, true]);
		await createData({
			className,
			updateObject: {
				module: {__type: 'Pointer', className: 'Module', objectId: currentModule.objectId},
				...data
			}
		});
		setDisabled([false, false]);
		setIsOpen(false);
		refetch();

	}, [data]);

	return (
		<>
			<button
				onClick={() => setIsOpen(true)}
				disabled={false}
				className='full_button md primary'
			>
                Neues Event erstellen
			</button>
			<SlideIn 
				isOpen={isOpen} 
				header='News erstellen' 
				cancel={() => setIsOpen(false)} 
				confirm={() => dataHandler()}
				disabled={disabled}
			>
				{fields && data && (
					<Form
						fields={fields} 
						data={data} 
						formSubmitHandler={(values) => setData( values as T['data'])}
						formValidationHandler={isValid => setDisabled(da => [da[0], !isValid])} 
					/>
				)}
			</SlideIn>
		</>
	);
};

export default CreateClass;