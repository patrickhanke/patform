import { useCallback, useContext, useMemo, useState } from 'react';
import { Field, SlideIn } from '@repo/ui';
import { AppContext, useDataHandler } from '@repo/provider';
import { Form } from '@repo/ui';
import { CreateCategoryProps } from '../types';

const CreateCategory = ({ refetch, typeId, typeLabel }: CreateCategoryProps ) => {
	const { createData } = useDataHandler();
	const { currentModule } = useContext(AppContext);
	const [isOpen, setIsOpen] = useState(false);
	const [data, setData] = useState({} as { [key: string]: any });
	const [disabled, setDisabled] = useState<[boolean, boolean]>([false, false]);	

	const categoryFields = useMemo(() => {
		const constantFields: Field[] = [
			{
				id: 'name',
				position: 1,
				name: 'name',
				type: 'input',
				label: 'Name',
				validation: {
					required: 'Pflichtfeld',
					min_length: 6
				}
			},
			{
				id: 'description',
				position: 2,
				name: 'description',
				type: 'textarea',
				label: 'Beschreibung'
			},
			{
				id: 'image',
				position: 3,
				name: 'image',
				type: 'image',
				label: 'Bild'
			}
		];
		return constantFields;
	}, []);

	const handleSubmit = useCallback(async () => {
		await createData({
			className: 'Category',
			updateObject: {
				...data,
				category_id: typeId,
				module: {__type: 'Pointer', className: 'Module', objectId: currentModule.objectId}
			}
		});
		refetch();
		setIsOpen(false);
	}, [data, createData, refetch, typeId]);

	return (
		<div>
			<button className='full_button primary md'  onClick={() => setIsOpen(true)}>{`Eintrag zu ${typeLabel} hinzufügen`}</button>
			<SlideIn 
				header='Eintrag hinzufügen'
				isOpen={isOpen}
				cancel={() => setIsOpen(false)}
				confirm={handleSubmit}
				disabled={disabled}
			>
				<Form
					fields={categoryFields}
					data={data}
					formSubmitHandler={values => setData(values)}
					formValidationHandler={value => {
						const disabledCopy = [...disabled];
						if (disabledCopy[1] !== !value) {
							setDisabled([false, !value]);
						}
					}}
				/>
			</SlideIn>
		</div>
	);
};

export default CreateCategory;