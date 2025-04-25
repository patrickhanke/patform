import { Dispatch, SetStateAction } from "react";

export type FormFieldsProps = {
	formId: string;
	createField: boolean;
	setCreateField: Dispatch<SetStateAction<boolean>>;
};
