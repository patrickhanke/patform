import axios from "axios";

interface DataObject {
	[key: string]: any; // Represents a generic data object
}

interface PropertyMapping {
	[key: string]: string; // Maps input property names to output property names
}

interface ServerResponse {
	success: boolean;
	message: string;
	data?: any;
}

const dataTransporterFunction = async (
	dataObjects: DataObject[],
	propertyMapping: PropertyMapping
): Promise<ServerResponse> => {
	try {
		// Transform the array of data objects based on the property mapping
		const transformedData = dataObjects.map((dataObject) => {
			const transformedObject: DataObject = {};
			for (const [inputKey, outputKey] of Object.entries(
				propertyMapping
			)) {
				transformedObject[outputKey] = dataObject[inputKey];
			}
			return transformedObject;
		});

		// Send the transformed data to the server
		const response = await axios.post(
			`${process.env.SERVER_API_URL}/create-classes`,
			{ data: transformedData },
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${process.env.SERVER_API_TOKEN}`
				}
			}
		);

		// Return the server response
		return {
			success: true,
			message: "Classes created successfully",
			data: response.data
		};
	} catch (error: any) {
		// Handle errors
		return {
			success: false,
			message:
				error.response?.data?.message ||
				"An error occurred while creating the classes"
		};
	}
};

export default dataTransporterFunction;
