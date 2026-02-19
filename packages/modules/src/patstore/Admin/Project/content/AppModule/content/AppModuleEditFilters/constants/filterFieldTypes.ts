/**
 * Field types from GraphQL schema (StringWhereInput, IdWhereInput, ArrayWhereInput, etc.)
 */
const filterFieldTypes = [
	{ value: "String", label: "String" },
	{ value: "Pointer", label: "Pointer" },
	{ value: "Array", label: "Array" },
	{ value: "Date", label: "Date" },
	{ value: "Number", label: "Number" },
	{ value: "Id", label: "ID" },
	{ value: "Boolean", label: "Boolean" }
] as const;

export default filterFieldTypes;
