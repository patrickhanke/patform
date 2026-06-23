const user_fields = [
	"objectId",
	"type",
	"label",
	"email",
	"data",
	"first_name",
	"last_name",
	"title",
	"emails",
	"settings"
] as const;

export const USER_QUERY_FIELDS: string[] = [...user_fields];

export default user_fields;
