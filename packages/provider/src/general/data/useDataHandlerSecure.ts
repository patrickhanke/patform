"use client";

import { useCallback, useContext, useState } from "react";
import { useDataContext } from "./DataContext";
import { PatstoreAppContext } from "../../patstore";
import useNetlifyHooks from "./hooks/useNetlifyHooks";
import Parse from "./parse";
import { formatISO9075 } from "date-fns";
import Cookies from "js-cookie";
import { ClientParseError } from "@apollo/client";

/**
 * Secure data handler that routes all API calls through Next.js edge functions
 * This prevents exposing API keys and queries in the browser
 */
const useDataHandlerSecure = (useMasterKey = false, useProjectKey = true) => {
	const setFeedback = (a: string, b: string, c: Date) => console.log(a, b, c);
	const [loading, setLoading] = useState(false);
	const { feedbackHandler } = useDataContext();
	const { user, userLoading, project } = useContext(PatstoreAppContext);
	const netlifyHookHandler = useNetlifyHooks();

	// Get the API base URL (should be set in your environment)
	const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/api";

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

			try {
				const response = await fetch(`${API_BASE}/data`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						className: className === "User" ? "_User" : className,
						objectId,
						updateObject,
						useMasterKey,
						userId: user?.objectId,
						projectId: useProjectKey ? project?.objectId : undefined
					})
				});

				const result = await response.json();

				if (!response.ok) {
					throw new Error(result.error || "Update failed");
				}

				data = result.results || [];

				if (feedback) {
					feedbackHandler({
						success: true,
						message: feedback,
						type: "success"
					});
				}

				if (afterSaveHandler) {
					afterSaveHandler(result.objectId);
				}
			} catch (error: any) {
				if (feedback) {
					feedbackHandler({
						success: false,
						message: error.message,
						type: "error"
					});
				}
				if (onError) {
					onError(error.message);
				}
			}

			netlifyHookHandler(className);
			setLoading(false);
			return data;
		},
		[user, userLoading, project, useMasterKey, useProjectKey]
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

			try {
				const response = await fetch(
					`${API_BASE}/data?className=${className === "User" ? "_User" : className}&objectId=${objectId}&useMasterKey=${useMasterKey}`,
					{
						method: "DELETE"
					}
				);

				const result = await response.json();

				if (!response.ok) {
					throw new Error(result.error || "Delete failed");
				}

				if (feedback) {
					feedbackHandler({
						success: true,
						message: feedback,
						type: "success"
					});
				}

				if (afterSaveHandler) {
					afterSaveHandler(result.objectId);
				}
			} catch (error: any) {
				feedbackHandler({
					success: false,
					message: error.message,
					type: "error"
				});
			}

			netlifyHookHandler(className);
			setLoading(false);
			setFeedback("", "", new Date());
		},
		[user, useMasterKey]
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

			try {
				const response = await fetch(`${API_BASE}/data`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						className: className === "User" ? "_User" : className,
						updateObject,
						useMasterKey,
						userId: userId || user?.objectId,
						projectId: project?.objectId
					})
				});

				const result = await response.json();

				if (!response.ok) {
					throw new Error(result.error || "Create failed");
				}

				if (feedback) {
					feedbackHandler({
						success: true,
						message: feedback,
						type: "success"
					});
				}

				if (afterSaveHandler) {
					afterSaveHandler(result);
				}
			} catch (error: any) {
				feedbackHandler({
					success: false,
					message: error.message,
					type: "error"
				});
			}

			netlifyHookHandler(className);
			setLoading(false);
			return data;
		},
		[user, project, useMasterKey]
	);

	const getData = useCallback(
		async ({ className, query }: { className: string; query?: string }) => {
			let data: Array<any> = [];
			setLoading(true);

			try {
				const queryParams = new URLSearchParams({
					className: className === "User" ? "_User" : className,
					useMasterKey: useMasterKey.toString()
				});

				if (query) {
					queryParams.append("query", query);
				}

				const response = await fetch(
					`${API_BASE}/data?${queryParams.toString()}`
				);
				const result = await response.json();

				if (!response.ok) {
					throw new Error(result.error || "Get data failed");
				}

				data = result.results || [];
			} catch (error: any) {
				console.error(`Error: ${error.message}`);
				feedbackHandler({
					success: false,
					message: error.message,
					type: "error"
				});
			}

			setLoading(false);
			return data;
		},
		[user, useMasterKey]
	);

	// File operations still use Parse SDK as they require special handling
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
							success: false,
							message: error.message,
							type: "error"
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
					.catch((error: any) => {
						feedbackHandler({
							success: false,
							message: error.message,
							type: "error"
						});
					});
			}
			netlifyHookHandler(className);
		},
		[user, project]
	);

	const uploadFile = useCallback(async ({ file }: { file: File }) => {
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

		try {
			const fileName = replaceUmlaute(file.name as string);
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
					feedbackHandler({
						success: false,
						message: error.message,
						type: "error"
					});
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

export default useDataHandlerSecure;
