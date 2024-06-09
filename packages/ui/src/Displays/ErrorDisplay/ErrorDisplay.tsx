import React, { useMemo } from 'react';
import { ErrorMessage } from '@repo/types';
import './styles.scss';

const ErrorDisplay = ({id, errors}: {id?: string, errors?: ErrorMessage[]}) => {
	const errorMessages = useMemo(() => {
		const errorArray: ErrorMessage[] = [];
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
		return <div className={'error_container'}>
			{errorMessages.map(error => (
				<div key={error.key} className={'error_message'}>
					{error.message}
				</div>
			))}
		</div>; 
	}
	return null;
};

export default ErrorDisplay;