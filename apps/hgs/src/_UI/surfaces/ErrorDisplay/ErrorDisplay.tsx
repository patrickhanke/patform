import { ApplicationTypes } from '@/types';
import React, { useMemo } from 'react';
import styles from './ErrorDisplay.module.scss';

const ErrorDisplay = ({id, errors}: {id?: string, errors?: ApplicationTypes.ErrorMessage[]}) => {
	const errorMessages = useMemo(() => {
		const errorArray: ApplicationTypes.ErrorMessage[] = [];
		if (id) {

			errors?.forEach(error => {
				if (error.id === id) {
					errorArray.push(error);
				}
			});
		} else {
			errors?.forEach(error => {
				errorArray.push(error);
			});
		}
		return errorArray;
	}, [errors]);

	if (errors && errors.length > 0 && errorMessages.length > 0) {
		return <div className={styles.error_container}>
			{errorMessages.map(error => (
				<div key={error.key} className={styles.error_message}>
					{error.message}
				</div>
			))}
		</div>; 
	}
	return null;
};

export default ErrorDisplay;