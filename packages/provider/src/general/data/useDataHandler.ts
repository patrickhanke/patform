"use client";

import { useCallback, useContext, useState } from "react";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import axiosclient from "./axios";
import { useDataContext } from "./DataContext";
import compileAxiosError from "./compileAxiosError";
import { cloneDeep, set } from "lodash-es";
import { PatstoreAppContext } from "../../patstore";
import useNetlifyHooks from "./hooks/useNetlifyHooks";
import Parse from "./parse";
import { Meta, UppyFile } from "@uppy/core";
import { formatISO9075 } from "date-fns";
import Cookies from "js-cookie";
import { ClientParseError } from "@apollo/client";

const useDataHandler = (useMasterKey = false) => {
	const setFeedback = (a: string, b: string, c: Date) => console.log(a, b, c);
	const [loading, setLoading] = useState(false);
	const { feedbackHandler } = useDataContext();
	const { user, userLoading } = useContext(PatstoreAppContext);
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
						console.log("afterSaveHandler", afterSaveHandler);

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

	const createImage = useCallback(
		async ({
			file,
			name,
			afterSaveHandler,
			feedback,
			moduleId
		}: {
			file: UppyFile<{ type: string }, Record<string, never>>;
			name: string;
			afterSaveHandler?: (data: any) => void;
			feedback?: string;
			moduleId: string;
		}) => {
			const parseFile = new Parse.File(file.name, file.data);
			await parseFile.save();

			console.log("File saved to Parse:", parseFile);

			const FileObject = Parse.Object.extend("Image");
			const obj = new FileObject();
			obj.set("file", parseFile);
			obj.set("connected_elements", []);
			obj.set("categories", []);
			obj.set("fields", []);
			obj.set("description", "");
			obj.set("date", formatISO9075(new Date()));
			obj.set("name", name || file.name);
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
						console.log("afterSaveHandler", afterSaveHandler);
						afterSaveHandler(response.data);
					}
				})
				.catch((error) => {
					console.log(error);
				});

			return obj;
		},
		[]
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
			file: UppyFile<Meta, Record<string, never>>;
			name: string;
			className: "Download" | "Image";
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
			console.log({ fileName });
			console.log({ classKey, className, classId });

			const parseFile = new Parse.File(fileName, file.data);
			await parseFile.save();

			console.log("File saved to Parse:", parseFile);

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
				} else {
					obj.set(classKey, parseFile);
					obj.set("categories", []);
					obj.set("fields", []);
					obj.set("description", "");
					obj.set("date", formatISO9075(new Date()));
					obj.set("name", name || fileName);
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
							console.log("afterSaveHandler", afterSaveHandler);
							afterSaveHandler(response.data);
						}
					})
					.catch((error: ClientParseError) => {
						console.log(error);
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
						}
						if (afterSaveHandler) {
							console.log("afterSaveHandler", afterSaveHandler);
							afterSaveHandler(response.data);
						}
					})
					.catch((error) => {
						console.log(error);
					});
			}
		},
		[]
	);

	const addImage = useCallback(
		async ({
			file,
			afterSaveHandler,
			feedback,
			className,
			classId,
			classKey
		}: {
			file: UppyFile<{ type: string }, Record<string, never>>;
			afterSaveHandler?: (data: any) => void;
			feedback?: string;
			className: string;
			classId: string;
			classKey: string;
		}) => {
			const replaceUmlaute = (fileName: string): string => {
				return fileName
					.replace(/ä/g, "ae")
					.replace(/Ä/g, "Ae")
					.replace(/ö/g, "oe")
					.replace(/Ö/g, "Oe")
					.replace(/ü/g, "ue")
					.replace(/Ü/g, "Ue")
					.replace(/ß/g, "ss");
			};
			const fileName = replaceUmlaute(file.name as string);
			console.log({ fileName });
			const parseFile = new Parse.File(fileName, file.data);
			await parseFile.save();

			console.log("File saved to Parse:", parseFile);

			const classQuery = new Parse.Query(className);
			const classObject = await classQuery.get(classId);
			classObject.set(classKey, parseFile);

			await classObject
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
						console.log("afterSaveHandler", afterSaveHandler);
						afterSaveHandler(response.data);
					}
				})
				.catch((error) => {
					console.log(error);
				});

			return classObject;
		},
		[]
	);

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

			console.log("File saved to Parse:", parseFile);

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
						console.log("afterSaveHandler", afterSaveHandler);

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
		createImage,
		updateImage,
		createUpdateFile,
		addImage
	};
};

export default useDataHandler;
