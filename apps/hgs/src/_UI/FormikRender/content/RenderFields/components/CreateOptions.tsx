import React from 'react';
import { CreateOptions, optionType } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import CreateButton from '@/_UI/interfaces/CreateButton/CreateButton';
import { get, isArray } from 'lodash';
import IconButton from '@/_UI/interfaces/IconButton/IconButton';
import styles from '../RenderFields.module.scss';
import { FormikContextType, useFormikContext } from 'formik';

const CreateOptions = ({field, values, setFieldValue}: CreateOptions) => {
	const { setStatus } = useFormikContext() as FormikContextType<{values: object, initialValues: object, setValues: FunctionConstructor}>;

	const onClickHandler = () => {
		const valueArray = get( values, field.name, []);

		valueArray.push({
			label: 'Neue Option',
			id: uuidv4()
		});
		setFieldValue(field.name, valueArray);
		setStatus('changed');
	};
    
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
		setFieldValue(`${field.name}[${index}].label`, e.target.value);
	};
    
	const handleDelete = (index: number) => {
		const valueArray = get( values, field.name, []);
		valueArray.splice(index, 1);
		setFieldValue(field.name, valueArray);
		setStatus('changed');
	};

	return (
		< >
			{isArray(get(values, field.name, [])) && get(values, field.name, []).map((option: optionType, index: number) => (
				<div key={option.id} className={styles.create_option_container}>
					<input 
						name={field.name}
						type='input'
						value={option.label}
						onChange={e => handleChange(e, index)}
					/>
					<IconButton icon='delete' onClick={() => handleDelete(index)} />

				</div>
			))}
			<CreateButton
				text='Option hinzufügen'
				onClick={onClickHandler}
				size='small'
			/>
		</>
	);
};

export default CreateOptions;