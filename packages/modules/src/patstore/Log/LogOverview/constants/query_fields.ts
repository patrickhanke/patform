const query_fields =
	process.env.APP_NAME === "patstore"
		? [
				"objectId",
				"type",
				"class",
				"data",
				"message",
				"user { label, first_name, last_name, email, portrait { name url } }",
				"module { name }",
				"service",
				"object_id",
				"operation",
				"createdAt",
				"updatedAt"
			]
		: [
				"objectId",
				"type",
				"class",
				"data",
				"message",
				"user { label, first_name, last_name, email, portrait { name url } }",
				"service",
				"object_id",
				"operation",
				"createdAt",
				"updatedAt"
			];

export default query_fields;
