import { useDataHandler } from '@/provider';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import styles from '../UserOverview.module.scss';
import { ErrorMessage } from '@/types';
import { IconButton, SlideInRight, TextInput } from '@repo/ui';

const SetStaffMemberPassword = ({userId}: {userId: string}) => {
	const [showSlideIn, setShowSlideIn] = useState(false);
	const [errors, setErrors] = useState([] as unknown as ErrorMessage[]);
	const {updateData} = useDataHandler();
	const [staffMember, setStaffMember] =  useImmer({
		password: '',
		repeat_password: ''
	}  );

	useEffect(() => {
		const errorArray : ErrorMessage[] = [];
		if (!staffMember.password) {
			errorArray.push({message: 'Bitte ein Passwort eingeben', key: 'password', id: 'password'});
		}
		if (!staffMember.repeat_password) {
			errorArray.push({message: 'Bitte das Passwort wiederholen', key: 'repeat_password', id: 'repeat_password'});
		}
		if (staffMember.repeat_password && staffMember.repeat_password !== staffMember.password ) {
			errorArray.push({message: 'Die beiden Passwörter stimmen nicht überein', key: 'repeat_password', id: 'repeat_password'});
		}
		setErrors(errorArray);

	}, [staffMember]);

	const resetPassword = (password: string) => {
		updateData({
			className: '_User',
			objectId: userId,
			updateObject: {
				password: password
			}
                
		});
		setShowSlideIn(false);
	};

	return (
		<>
			<IconButton icon='password' onClick={() => setShowSlideIn(true)}  />
			<SlideInRight
				header='Passwort ändern'
				isOpen={showSlideIn}
				setIsOpen={setShowSlideIn}
				preventClickOutside
			>
				<div className={styles.slidein_container} >
					<form>
						<p>Sie können hier ein neues Passowort für den Nutzer setzen?</p>
						<TextInput
							label='Passwort'
							type='password'
							id={'password'}
							onChange={(value) => setStaffMember(draft => {
								draft.password = value;
							})}
							errors={errors}
						/>
						<TextInput
							label='Passwort wiederholen'
							type='password'
							id={'repeat_password'}
							onChange={(value) => setStaffMember(draft => {
								draft.repeat_password = value;
							})}
							errors={errors}
						/>
					</form>
					<div className='button_container'>
						<button className={clsx('full_button', 'primary', 'md')} disabled={errors.length > 0} onClick={() => resetPassword(staffMember.password)}>
							Passwort setzen
						</button>
						<button className={clsx('full_button', 'secondary', 'md')} onClick={() => setShowSlideIn(false)}>
							Abbrechen
						</button>
					</div>
				</div>
			</SlideInRight>
		</>
	);
};

export default SetStaffMemberPassword;