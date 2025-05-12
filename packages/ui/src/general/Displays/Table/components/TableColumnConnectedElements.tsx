const TableColumnConnectedElements = ({
	value = []
}: {
	value: Array<object>;
}) => {
	return <div>{`${value?.length} Verbundenen Element(e)`}</div>;
};

export default TableColumnConnectedElements;
