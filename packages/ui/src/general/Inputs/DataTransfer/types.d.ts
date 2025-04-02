import { DocumentNode } from "@apollo/client";

export type DataTranferProps<T> = {
	sourceClassName: string;
	targetClassName: string;
	moduleId: string;
	query: DocumentNode;
	url: string;
	appId: string;
	masterKey: string;
	propertyMapping: (D: DataObject) => T;
};

export type GenerateQuery = (T: {
	objectName: string;
	fields: string[];
}) => DocumentNode;

export type DataValue =
	| string
	| object
	| number
	| boolean
	| Array<string | object>;

export type DataObject = {
	[key: string]: DataValue; // Represents a generic data object
};

export type PropertyMapping<T> = {
	
	[key in keyof T]: (data: DataObject) => T[key]; // Maps input property names to output property values
};

export type UploadFromUrl = (t: {
	accountId: string;
	apiKey: string;
	requestBody: { url: string };
	projectPath: string;
}) => Promise<{
	filePath: string;
	result: object;
}>;

export type CheckDataElements = (t: {
	dataElement: DataObject;
	projectPath: string;
}) => Promise<DataObject>;
