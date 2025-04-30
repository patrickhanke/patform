"use client";

import { useCallback, useContext, useMemo, useState } from "react";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import axiosclient from "./axios";
import { useDataContext } from "./DataContext";
import compileAxiosError from "./compileAxiosError";
import { cloneDeep, set } from "lodash-es";
import { PatstoreAppContext } from "../../patstore";

const useDataHandler = (useMasterKey = false) => {
	const setFeedback = (a: string, b: string, c: Date) => console.log(a, b, c);
	const [loading, setLoading] = useState(false);
	const { feedbackHandler } = useDataContext();
	const { user, userLoading } = useContext(PatstoreAppContext);

	console.log({ user });

	const updateData = useCallback(
		async ({
			className,
			objectId,
			updateObject,
			afterSaveHandler,
			feedback,
			onError
		}: {
			className: string;
			objectId: string;
			updateObject: {
				[key: string]: string | number | boolean | object | Array<any>;
			};
			afterSaveHandler?: (objectId: string) => void;
			feedback?: string;
			onError?: (error: string) => void;
		}) => {
			let data: Array<any> = [];
			setLoading(true);
			const updateObjectCopy = cloneDeep(updateObject);

			console.log({ user });

			if (user?.objectId) {
				set(updateObjectCopy, "updated_by", {
					__type: "Pointer",
					className: "_User",
					objectId: user.objectId
				});
			}
			console.log("UpdateObject", updateObjectCopy);

			await axiosclient(useMasterKey)
				.put(
					`classes/${className}/${objectId}`,
					updateObjectCopy as AxiosRequestConfig<any>
				)
				.then((response: AxiosResponse<any, any>) => {
					data = response.data.results;
					if (feedback) {
						feedbackHandler({
							success: true,
							message: feedback,
							type: "success"
						});
					}
					if (afterSaveHandler) {
						afterSaveHandler(response.data.objectId);
					}
				})
				.catch((error) => {
					if (feedback) {
						feedbackHandler(compileAxiosError(error));
					}
					if (onError) {
						onError(error.message);
					}
				});
			setLoading(false);

			return data;
		},
		[user, userLoading]
	);

	const deleteData = useCallback(
		async ({
			className,
			objectId,
			afterSaveHandler,
			feedback
		}: {
			className: string;
			objectId: string;
			afterSaveHandler?: (objectId: string) => void;
			feedback?: string;
		}) => {
			setLoading(true);
			if (feedback) {
				setFeedback("lädt", "loading", new Date());
			}
			await axiosclient(useMasterKey)
				.delete(`classes/${className}/${objectId}`)
				.then((response: AxiosResponse<any, any>) => {
					if (feedback) {
						feedbackHandler({
							success: true,
							message: feedback,
							type: "success"
						});
					}
					if (afterSaveHandler) {
						afterSaveHandler(response.data.objectId);
					}
				})
				.catch((error) => {
					feedbackHandler(compileAxiosError(error));
				});
			setLoading(false);
			setFeedback("", "", new Date());
		},
		[user]
	);

	const createData = useCallback(
		async ({
			className,
			query,
			updateObject,
			afterSaveHandler,
			feedback
		}: {
			className: string;
			query?: string;
			updateObject?: any;
			afterSaveHandler?: (objectId: string) => void;
			feedback?: string;
		}) => {
			const data: Array<any> = [];
			setLoading(true);
			const updateObjectCopy = cloneDeep(updateObject);
			if (user?.objectId) {
				set(updateObjectCopy, "created_by", {
					__type: "Pointer",
					className: "_User",
					objectId: user.objectId
				});
			}
			await axiosclient(useMasterKey)
				.post(
					`classes/${className}`,
					query || (updateObject as AxiosRequestConfig<any>)
				)
				.then((response: AxiosResponse<any, any>) => {
					if (feedback) {
						feedbackHandler({
							success: true,
							message: feedback,
							type: "success"
						});
					}
					if (afterSaveHandler) {
						afterSaveHandler(response.data.objectId);
					}
				})
				.catch((error) => {
					feedbackHandler(compileAxiosError(error));
				});
			setLoading(false);
			return data;
		},
		[user]
	);

	const getData = useCallback(
		async ({ className, query }: { className: string; query?: string }) => {
			let data: Array<any> = [];
			setLoading(true);
			if (query) {
				await axiosclient(useMasterKey)
					.get(`classes/${className}?where={${query}}`)
					.then((response: AxiosResponse<any, any>) => {
						data = response.data.results;
					})
					.catch((error) => {
						console.error(`Error: ${error.message}`);
					});
			}
			if (!query) {
				await axiosclient(useMasterKey)
					.get(`classes/${className}`)
					.then((response: AxiosResponse<any, any>) => {
						data = response.data.results;
					})
					.catch((error) => {
						feedbackHandler(compileAxiosError(error));
					});
			}
			setLoading(false);
			return data;
		},
		[user]
	);

	const returnFunctions = useMemo(() => {
		return {
			loading,
			updateData,
			createData,
			deleteData,
			getData
		};
	}, [user]);

	return {
		loading,
		updateData,
		createData,
		deleteData,
		getData
	};
};

export default useDataHandler;
