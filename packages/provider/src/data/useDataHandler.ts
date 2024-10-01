'use client';

import { useCallback, useMemo, useState } from 'react';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import axiosapi from './axios.ts';
import axiosclient from './axios.ts';

const useDataHandler = () => {
	const setFeedback = (a: string,b: string,c: Date) => console.log(a,b,c);
	const [loading, setLoading] = useState(false);


	// const createMessageHandler = async (type: MessageTypes.MessageTypes, id: string, users: UserTypes.User['objectId'][] ) => {
	// 	const updateObject: MessageTypes.MessageUpdateObject = {
	// 		is_read: false,
	// 		type: type
	// 	};  

	// 	if (type === 'task_created') {
	// 		updateObject.task = {__type: 'Pointer', className: 'Task', objectId: id};
	// 	}

	// 	if (type === 'ticket_created') {
	// 		updateObject.ticket = {__type: 'Pointer', className: 'Ticket', objectId: id};
	// 	}

	// 	users.forEach(userId => {
	// 		createData({
	// 			className: 'Message',   
	// 			updateObject: {
	// 				...updateObject,
	// 				created_by: {__type: 'Pointer', className: '_User', objectId: user.objectId},
	// 				user: {__type: 'Pointer', className: '_User', objectId: userId}
	// 			}
	// 		});
	// 	});
	// };


	const updateData = useCallback( async ({
		className, 
		objectId, 
		updateObject, 
		afterSaveHandler, 
		feedback
	}: {
        className: string, 
        objectId: string, 
        updateObject: any, 
        afterSaveHandler?: (objectId: string) => void,
        feedback?: string
    }) => {
		let data : Array<any> = [];
		setLoading(true);
        
		await axiosapi().put(`classes/${className}/${objectId}`,updateObject as AxiosRequestConfig<any> )
			.then((response : AxiosResponse<any, any>) => {
				data = response.data.results;
				if (feedback) {
					setFeedback(feedback,'success', new Date() );
				}
				if (afterSaveHandler) {
					afterSaveHandler(response.data.objectId);
				}
			})
			.catch(error => {
				console.log(error.message);
				if (feedback) {
					setFeedback('Fehler','error', new Date() );
				}
			});
		setLoading(false);

		return data;
	}, []);

	const deleteData = useCallback(async ({
		className, 
		objectId, 
		afterSaveHandler,
		feedback
	}: {
        className: string, 
        objectId: string, 
        afterSaveHandler?: (objectId: string) => void,
        feedback?: string
    }) => {
		setLoading(true);
		if (feedback) {
			setFeedback('lädt','loading', new Date() );
		}
		await axiosclient().delete(`classes/${className}/${objectId}`)
			.then((response : AxiosResponse<any, any>) => {
				if (feedback) {
					setFeedback(feedback, 'success',new Date());
				}
				if (afterSaveHandler) {
					afterSaveHandler(response.data.objectId);
				}
			})
			.catch(error => {
				console.log(error.message);
				setFeedback('Fehler', 'error', new Date());
			});
		setLoading(false);
		setFeedback('','', new Date() );
	},[]);

	const createData = useCallback(async ({
		className, 
		query, 
		updateObject, 
		afterSaveHandler,
		message,
		feedback
	}: {
        className: string, 
        query?: string, 
        updateObject?: any, 
        afterSaveHandler?: (objectId: string) => void,
		message?: {type: string, users: string[]}
        feedback?: string
    }) => {
		const data : Array<any> = [];
		setLoading(true);
		await axiosapi().post(`classes/${className}`, query || updateObject as AxiosRequestConfig<any> )
			.then((response : AxiosResponse<any, any>) => {
				if (feedback) {
					setFeedback(feedback, 'success',new Date());
				}
				if (afterSaveHandler) {
					afterSaveHandler(response.data.objectId);
				}
				// if (message) {
				// 	createMessageHandler(message.type, response.data.objectId, message.users);
				// }
			})
			.catch(error => {
				console.log(error.message);
				setFeedback('Fehler', 'error', new Date());
			});
		setLoading(false);
		return data;
	}, []);

	const getData = useCallback( async ({className, query}: {className: string, query?: string}) => {
		let data : Array<any> = [];
		setLoading(true);
		if (query) {
			await axiosapi().get(`classes/${className}?where={${query}}`)
				.then((response : AxiosResponse<any, any>) => {
					data = response.data.results;
				})
				.catch(error => {
					console.error(`Error: ${error.message}`);
				});
			
		}
		if (!query) {
			await axiosapi().get(`classes/${className}`)
				.then((response : AxiosResponse<any, any>) => {
					data = response.data.results;
				})
				.catch(error => {
					console.error(`Error: ${error.message}`);
				});
		}
		setLoading(false);
		return data;
	}, []);

	const returnFunctions = useMemo(() => {
		return({
			loading,
			updateData,
			createData, 
			deleteData,
			getData
		});
	}, []);

	return returnFunctions;
};

export default useDataHandler;