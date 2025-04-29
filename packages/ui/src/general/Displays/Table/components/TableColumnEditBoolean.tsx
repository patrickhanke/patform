import { StatelessToggle } from "@repo/ui";

const TableColumnEditBoolean = ({
	value,
	onChange
}: {
	value: boolean;
	onChange: (T: boolean) => Promise<void>;
}) => {
	return (
		<div>
			<StatelessToggle value={value} onChange={onChange} />
		</div>
	);
};

export default TableColumnEditBoolean;
