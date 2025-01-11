import React, {useState, useEffect, Dispatch, SetStateAction} from 'react';
import clsx from 'clsx';
import styles from '../UserOverview.module.scss';
import { useImmer } from 'use-immer';
import { useQuery } from '@apollo/client';
import { FIND_ALL_ROLES } from '@queries';
import { generateColor } from '@repo/provider';
import { CreateUser, ErrorMessage } from '@types';
import { ImageUploader, Select, TextInput } from '@repo/ui';

type RoleSelect= {
    id: string,
    value: string,
    label: string
}

const CreateStaffMember = ({workers = [], setIsOpen, createWorker, loading = false}: {workers: UserTypes.User[], setIsOpen: Dispatch<SetStateAction<boolean>>, createWorker: (W: UserTypes.CreateUser, N: number )=> void, loading: boolean}) => {
	const {data: roleData} = useQuery(FIND_ALL_ROLES); 
	const [errors, setErrors] = useState([] as unknown as ErrorMessage[]);
	const [worker, setWorker] =  useImmer({
		family_name: '',
		first_name: '',
		email: '',
		role: '',
		password: '',
		repeat_password: '',
		color: generateColor()
	} as CreateUser );

	useEffect(() => {
		const errorArray : ErrorMessage[] = [];
		workers.forEach(existingWorker => {
			if (existingWorker.family_name === worker.family_name && existingWorker.first_name === worker.first_name)  {
				errorArray.push({message: 'Dieser Name existiert bereits', key: 'family_name_group', id: 'family_name'});
			} 
		});
		if (!worker.first_name) {
			errorArray.push({message: 'Bitte einen Vornamen angeben', key: 'first_name', id: 'first_name'});
		}
		if (!worker.family_name) {
			errorArray.push({message: 'Bitte einen Nachnamen angeben', key: 'family_name', id: 'family_name'});
		}
		if (!worker.role) {
			errorArray.push({message: 'Bitte eine Rolle auswählen', key: 'role', id: 'role'});
		}
		if (!worker.email) {
			errorArray.push({message: 'Bitte eine E-Mail Adresse angeben', key: 'email', id: 'email'});
		}
		if (!worker.password) {
			errorArray.push({message: 'Bitte ein Passwort angeben', key: 'password', id: 'password'});
		}
		if (!worker.repeat_password) {
			errorArray.push({message: 'Bitte das Passwort wiederholen', key: 'repeat_password', id: 'repeat_password'});
		}
		if (worker.repeat_password && worker.repeat_password !== worker.password ) {
			errorArray.push({message: 'Die beiden Passwörter stimmen nicht überein', key: 'repeat_password', id: 'repeat_password'});
		}

		setErrors(errorArray);

	}, [worker]);

	return (
		<div className={styles.slidein_container} >
			<form>
				<p>
					Hier kann ein neuer Mitarbeiter angelegt werden werden. 
				</p>
				<TextInput
					label='Vorname'
					id={'first_name'}
					onChange={(value) => setWorker(draft => {
						draft.first_name = value;
					})} 
					errors={errors}
				/>
				<TextInput
					label='Nachname'
					id={'family_name'}
					onChange={(value) => setWorker(draft => {
						draft.family_name = value;
					})} 
					errors={errors}
				/>
				<TextInput
					label='E-Mail'
					id={'email'}
					type='email'
					onChange={(value) => setWorker(draft => {
						draft.email = value;
					})} 
					errors={errors}
				/>
				<Select
					label='Rolle auswählen'
					id='role'
					errors={errors}
					options={roleData && roleData.objects.find_Role.results.map((role: UserTypes.UserRole) => ({value: role.objectId, id: role.objectId, label: role.name}))}
					value={worker.role && roleData && roleData.objects.find_Role.results.map((role: UserTypes.UserRole) => ({value: role.objectId, id: role.objectId, label: role.name})).find((roleToFind: RoleSelect) => roleToFind.id === worker.role) }
					onChange={value => setWorker(draft => {
						draft.role = value.value;
					})}
				/>
				<ImageUploader
					label='Bild auswählen'
					path='users'
					filename={`${worker.first_name}_${worker.family_name}_${new Date()}_portrait.jpg`}
					previewImage={worker.portrait || undefined}
					onChange={(images) => setWorker(draft => {
						draft.portrait = images[0];
					})}
					maxFileCount={1}
				/>
				<TextInput
					label='Passwort'
					type='password'
					id={'password'}
					onChange={(value) => setWorker(draft => {
						draft.password = value;
					})} 
					errors={errors}
				/>
				<TextInput
					label='Passwort wiederholen'
					type='password'
					id={'repeat_password'}
					onChange={(value) => setWorker(draft => {
						draft.repeat_password = value;
					})} 
					errors={errors}
				/>
				<div>
					<label>
						Farbe auswählen
					</label>
					<ColorPicker
						color={worker.color}
						onChange={(value: string) => setWorker(draft => {
							draft.color = value;
						})}
						errors={errors}
					/>
				</div>
			</form>
			<div className='button_container'>
				<button className={clsx('full_button', 'primary', 'md')} disabled={errors.length > 0 || loading} onClick={() => createWorker(worker, workers.length + 1)}>
					Mitarbeiter erstellen
				</button>
				<button className={clsx('full_button', 'secondary', 'md')} onClick={() => setIsOpen(false)} disabled={loading}>
					Abbrechen
				</button>
			</div>
		</div>
	);
};

export default CreateStaffMember;