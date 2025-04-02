import { DocumentNode } from "@apollo/client";

export type DataTranferProps = {
	sourceClassName: string;
	targetClassName: string;
	moduleId: string;
	query: DocumentNode;
	url: string;
	appId: string;
	masterKey: string;
	propertyMapping: PropertyMapping;
};

export type GenerateQuery = (T: {
	objectName: string;
	fields: string[];
}) => DocumentNode;

export type DataObject = {
	[key: string]: any; // Represents a generic data object
};

export type PropertyMapping = {
	[key: string]: string; // Maps input property names to output property names
};

export type UploadFromUrl = (t: {
	accountId: string;
	apiKey: string;
	requestBody: { url: string };
	projectPath: string;
}) => Promise<{
	filePath: string, result: object };>;

export type CheckDataElements = (t: {
	dataElement: DataObject;
	projectPath: string;
}) => Promise<DataObject>;
