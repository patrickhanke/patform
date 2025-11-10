import { TableColumnUserProps } from "../types";
import { UserDisplay } from "@repo/ui";

const TableColumnUser = ({ value }: TableColumnUserProps) => {
	console.log(value);
	if (!value) {
		return null;
	}

	return (
		<div>
			<UserDisplay user={value} />
		</div>
	);
};

export default TableColumnUser;
