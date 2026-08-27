import React from "react";
import { useGetData } from "@repo/provider";
import { Loader } from "@repo/ui";

const ConnectedElement = ({
	moduleId,
	objectId,
	className,
	isOpen
}: {
	moduleId: string;
	objectId: string;
	className: string;
	isOpen: boolean;
}) => {
	const { data, loading } = useGetData({
		objectName: className,
		fields: ["title", "objectId"],
		id: objectId,
		skip: !isOpen
	});

	const { data: moduleData, loading: moduleLoading } = useGetData({
		objectName: "Module",
		fields: ["name", "objectId"],
		id: moduleId,
		skip: !isOpen
	});

	console.log(data);
	console.log(moduleData);

	return (
		<div className="content_element">
			{moduleLoading ? (
				<Loader width="180px" height="12px" />
			) : (
				<h3>{moduleData?.name}</h3>
			)}
			{loading ? (
				<Loader width="180px" height="16px" />
			) : (
				<p>{data?.title}</p>
			)}
		</div>
	);
};

export default ConnectedElement;
