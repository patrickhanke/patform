"use client";

import { useCallback, useContext, useState } from "react";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import axiosclient from "./axios";
import { useDataContext } from "./DataContext";
import compileAxiosError from "./compileAxiosError";
import { cloneDeep, set } from "lodash-es";
import { PatstoreAppContext } from "../../patstore";
import useNetlifyHooks from "./hooks/useNetlifyHooks";
import Parse from "./parse";
import { formatISO9075 } from "date-fns";
import Cookies from "js-cookie";
import { ClientParseError } from "@apollo/client";

const useDataHandler = (useMasterKey = false, useProjectKey = true) => {
	const setFeedback = (a: string, b: string, c: Date) => console.log(a, b, c);
	const [loading, setLoading] = useState(false);
	const { feedbackHandler } = useDataContext();
	const { user, userLoading, project } = useContext(PatstoreAppContext);
	const netlifyHookHandler = useNetlifyHooks();

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
				[key: string]:
					| string
					| number
					| boolean
					| object
					| Array<any>
					| undefined;
			};
			afterSaveHandler?: (objectId: string) => void;
			feedback?: string;
			onError?: (error: string) => void;
		}) => {
			let data: Array<any> = [];
			setLoading(true);
			const updateObjectCopy = cloneDeep(updateObject);

			if (user?.objectId) {
				set(updateObjectCopy, "updated_by", {
					__type: "Pointer",
					className: "_User",
					objectId: user.objectId
				});
			}
			if (useProjectKey && project) {
				set(updateObjectCopy, "project", {
					__type: "Pointer",
					className: "Project",
					objectId: project.objectId
				});
			}

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
			netlifyHookHandler(className);
			setLoading(false);
			return data;
		},
		[user, userLoading, project]
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
			netlifyHookHandler(className);
			setLoading(false);
			setFeedback("", "", new Date());
		},
		[user]
	);

	const createData = useCallback(
		async ({
			className,
			updateObject,
			afterSaveHandler,
			feedback,
			userId
		}: {
			className: string;
			updateObject?: any;
			afterSaveHandler?: (data: any) => void;
			feedback?: string;
			userId?: string;
		}) => {
			const data: Array<any> = [];
			setLoading(true);
			console.log("userId", userId);

			const updateObjectCopy = cloneDeep(updateObject);
			if (userId) {
				set(updateObjectCopy, "created_by", {
					__type: "Pointer",
					className: "_User",
					objectId: userId
				});
			}

			if (project) {
				set(updateObjectCopy, "project", {
					__type: "Pointer",
					className: "Project",
					objectId: project.objectId
				});
			}

			await axiosclient(useMasterKey)
				.post(
					`classes/${className}`,
					updateObjectCopy as AxiosRequestConfig<any>
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
						afterSaveHandler(response.data);
					}
				})
				.catch((error) => {
					feedbackHandler(compileAxiosError(error));
				});
			netlifyHookHandler(className);
			setLoading(false);
			return data;
		},
		[user, project]
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

	const createUpdateFile = useCallback(
		async ({
			file,
			name,
			className,
			classKey,
			classId,
			afterSaveHandler,
			feedback,
			moduleId
		}: {
			file: File;
			name: string;
			className: "Download" | "Image" | "_User";
			classKey: string;
			classId?: string;
			afterSaveHandler?: (data: any) => void;
			feedback?: string;
			moduleId: string;
		}) => {
			const replaceUmlaute = (fileName: string): string => {
				return fileName
					.replace(/ä/g, "ae")
					.replace(/Ä/g, "Ae")
					.replace(/ö/g, "oe")
					.replace(/Ö/g, "Oe")
					.replace(/ü/g, "ue")
					.replace(/Ü/g, "Ue")
					.replace(/ß/g, "ss")
					.replace(/\(/g, "")
					.replace(/\)/g, "");
			};
			const fileName = replaceUmlaute(file.name as string);

			const parseFile = new Parse.File(fileName, file);
			await parseFile.save();

			let existingClassObject;

			if (classId && className) {
				const classQuery = new Parse.Query(className);
				const classObject = await classQuery
					.get(classId)
					.catch((error) => {
						console.error(error);
						return undefined;
					});

				if (classObject) {
					existingClassObject = classObject;
				}
			}

			if (!existingClassObject) {
				const obj = new Parse.Object(className);
				// at a certain point, the save method must be inferre from types associated with className
				if (className === "Download") {
					obj.set("file", parseFile);
					obj.set(classKey, parseFile);
					obj.set("categories", []);
					obj.set("title", name || fileName);
					obj.set("module", {
						__type: "Pointer",
						className: "Module",
						objectId: moduleId
					});
					obj.set("created_by", {
						__type: "Pointer",
						className: "_User",
						objectId: user.objectId
					});
					if (project) {
						obj.set("project", {
							__type: "Pointer",
							className: "Project",
							objectId: project.objectId
						});
					}
				} else {
					obj.set(classKey, parseFile);
					obj.set("categories", []);
					obj.set("fields", []);
					obj.set("description", "");
					obj.set("date", formatISO9075(new Date()));
					obj.set("title", name || fileName);
					obj.set("active", false);
					obj.set("module", {
						__type: "Pointer",
						className: "Module",
						objectId: moduleId
					});
					obj.set("created_by", {
						__type: "Pointer",
						className: "_User",
						objectId: user.objectId
					});
					if (project) {
						obj.set("project", {
							__type: "Pointer",
							className: "Project",
							objectId: project.objectId
						});
					}
				}
				await obj
					.save(null, {
						sessionToken: Cookies.get("patstore_token")
					})
					.then((response: any) => {
						if (feedback) {
							feedbackHandler({
								success: true,
								message: feedback,
								type: "success"
							});
						}
						if (afterSaveHandler) {
							afterSaveHandler(response.data);
						}
						return response.data;
					})
					.catch((error: ClientParseError) => {
						console.log(error);
						feedbackHandler({
							success: true,
							message: error.message,
							type: "success"
						});
					});
			} else {
				existingClassObject.set(classKey, parseFile);

				await existingClassObject
					.save(null, {
						sessionToken: Cookies.get("patstore_token")
					})
					.then((response: any) => {
						if (feedback) {
							feedbackHandler({
								success: true,
								message: feedback,
								type: "success"
							});
							if (afterSaveHandler) {
								afterSaveHandler(response.data);
							}
							return response.data;
						}
						if (afterSaveHandler) {
							afterSaveHandler(response.data);
						}
					})
					.catch((error: AxiosError) => {
						feedbackHandler({
							success: true,
							message: error.message,
							type: "success"
						});
					});
			}
			netlifyHookHandler(className);
		},
		[]
	);

	const uploadFile = useCallback(async ({ file }) => {
		const replaceUmlaute = (fileName: string): string => {
			return fileName
				.replace(/ä/g, "ae")
				.replace(/Ä/g, "Ae")
				.replace(/ö/g, "oe")
				.replace(/Ö/g, "Oe")
				.replace(/ü/g, "ue")
				.replace(/Ü/g, "Ue")
				.replace(/ß/g, "ss")
				.replace(/\(/g, "")
				.replace(/\)/g, "");
		};

		// Convert file to base64
		const toBase64 = (file: File): Promise<string> => {
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = () => {
					const base64String = reader.result as string;
					// Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
					const base64 = base64String.split(",")[1];
					resolve(base64);
				};
				reader.onerror = (error) => reject(error);
			});
		};

		try {
			const fileName = replaceUmlaute(file.name as string);
			// const base64 = await toBase64(file);

			const parseFile = new Parse.File(fileName, file);
			await parseFile.save(null, {
				sessionToken: Cookies.get("patstore_token")
			});

			return parseFile;
		} catch (error) {
			console.error("Error uploading file:", error);
			throw error;
		}
	}, []);

	const updateImage = useCallback(
		async ({
			file,
			name,
			imageId,
			afterSaveHandler,
			feedback
		}: {
			file: Blob;
			name: string;
			afterSaveHandler?: (data: any) => void;
			feedback?: string;
			imageId: string;
		}) => {
			const parseFile = new Parse.File(name, file);
			await parseFile.save();

			const imageQuery = new Parse.Query("Image");
			const image = await imageQuery.get(imageId);
			image.set("file", parseFile);

			await image
				.save(null, {
					sessionToken: Cookies.get("patstore_token")
				})
				.then((response: any) => {
					if (feedback) {
						feedbackHandler({
							success: true,
							message: feedback,
							type: "success"
						});
					}
					if (afterSaveHandler) {
						afterSaveHandler(response.data);
					}
				})
				.catch((error) => {
					console.log(error);
				});
		},
		[]
	);

	return {
		loading,
		updateData,
		createData,
		deleteData,
		getData,
		updateImage,
		createUpdateFile,
		uploadFile
	};
};

export default useDataHandler;
