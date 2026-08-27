import { useAppContext } from "@repo/provider";

const TableColumnConnectedElements = ({
	value = []
}: {
	value: Array<object>;
}) => {
	const { project } = useAppContext();
	
	return <div>{`${value?.length} Verbundenen Element(e)`}</div>;
};

export default TableColumnConnectedElements;
