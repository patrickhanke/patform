import { CreateClassData, getDatabaseDefaultFields } from "@repo/ui";

const createClassData: CreateClassData = ({
	className,
	text,
	fields,
	initialData
}) => {
	return {
		initialData,
		className,
		text,
		fields: getDatabaseDefaultFields(fields)
	};
};

export default createClassData;
