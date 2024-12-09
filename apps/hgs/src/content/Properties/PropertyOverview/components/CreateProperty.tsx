import React, {useState, useEffect, Dispatch, SetStateAction} from 'react';
import { PropertyTypes } from '@/types';
import styles from '../ProperyOverview.module.scss';
import { useImmer } from 'use-immer';
import { SlideInModal } from '@/_UI';
import initialData from '../constants/initialData';

const CreatePropterty = ({objects = [], isOpen, setIsOpen, createObject}: {objects: PropertyTypes.Property[], setIsOpen: Dispatch<SetStateAction<boolean>>, createObject: (data: typeof initialData )=> void, isOpen: boolean}) => {
	const [data, setData] = useImmer(initialData);

	const [error, setError] = useState('');

	useEffect(() => {
		objects.forEach(object => {
			if (object.name === data.name) {
				setError('Dieser Name existiert bereits');
			} else {
				if (error !== '') {
					setError('');
				}
			}
		});
	}, [data.name]);

	return (
		<SlideInModal
			header='Neues Objekt erstellen'
			cancel={() => setIsOpen(false)}
			confirm={() => createObject(data)}
			isOpen={isOpen}
			preventClickOutside={true}
		>
			<div className={styles.create_property_container} >
				<div>
					<p>
					Hier kann ein neues Objekt angelegt werden werden. 
					</p>
					<form>
					
						<div>
							<label htmlFor='text'>
							Name des Objekts
							</label>
							<input
								id='text'
								type='text'
								onChange={(e) => setData(draft => {
									draft.name = e.target.value;
								})}
							>
							</input>
						</div>
						<div>
							<label htmlFor='street'>
							Straße / Hausnummer
							</label>
							<input
								id='street'
								type='text'
								onChange={(e) => setData(draft => {
									draft.street = e.target.value;
								})}
							>
							</input>
						</div>
						<div>
							<label htmlFor='zip_code'>
							Postleitzahl
							</label>
							<input
								id='zip_code'
								type='number'
								onChange={(e) => setData(draft => {
									draft.zip_code = e.target.value as unknown as number;
								})}
							>
							</input>
						</div>
						
						<div>
							<label htmlFor='city'>
							Stadt
							</label>
							<input
								id='city'
								type='text'
								onChange={(e) => setData(draft => {
									draft.city = e.target.value;
								})}
							>
							</input>
						</div>

						{error && <div className='error_message'>{error} </div>}
					</form>
				</div>
				{/* <div className='button_container'>
					<button className={clsx('full_button', 'primary', 'md')} disabled={!!error} onClick={() => createObject(data)}>
					Objekt erstellen
					</button>
					<button className={clsx('full_button', 'secondary', 'md')} onClick={() => setIsOpen(false)}>
					Abbrechen
					</button>
				</div> */}
			</div>
		</SlideInModal>
	);
};

export default CreatePropterty;