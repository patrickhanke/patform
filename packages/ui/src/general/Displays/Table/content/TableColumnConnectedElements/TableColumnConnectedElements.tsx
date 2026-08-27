import { useAppContext, useGetData } from "@repo/provider";
import { useMemo, useState } from "react";
import { IconButton, SlideIn } from "@repo/ui";
import ConnectedElement from "./components/ConnectedElement";

const TableColumnConnectedElements = ({ value = "" }: { value: string }) => {
	const { project } = useAppContext();
	const { data: projectData } = useGetData({
		objectName: "Project",
		fields: ["connected_images"],
		id: project?.objectId
	});
	const connectedImages = projectData?.connected_images;

	const [showConnectedElements, setShowConnectedElements] = useState(false);

	const imageEntries = useMemo(() => {
		const imageEntries: {
			module_id: string;
			object_id: string;
			class_name: string;
		}[] = [];
		Object.keys(connectedImages).forEach((key) => {
			const images = connectedImages[key].images;
			if (images.includes(value)) {
				imageEntries.push({
					module_id: connectedImages[key].module_id,
					object_id: key,
					class_name: connectedImages[key].class_name
				});
			}
		});
		return imageEntries;
	}, [connectedImages, value]);

	console.log(imageEntries);

	return (
		<>
			<IconButton
				icon="eye"
				onClick={() => {
					setShowConnectedElements(!showConnectedElements);
				}}
				text={`${imageEntries.length} Verbundenen Element(e)`}
			/>
			<SlideIn
				header="Verbundene Elemente"
				isOpen={showConnectedElements}
				confirm={() => {
					setShowConnectedElements(false);
				}}
				cancel={() => {
					setShowConnectedElements(false);
				}}
				confirmText="Schließen"
				showCancelButton={false}
			>
				<div>
					{imageEntries.map((imageEntry) => (
						<ConnectedElement
							key={imageEntry.object_id}
							moduleId={imageEntry.module_id}
							objectId={imageEntry.object_id}
							className={imageEntry.class_name}
							isOpen={showConnectedElements}
						/>
					))}
				</div>
			</SlideIn>
		</>
	);
};

export default TableColumnConnectedElements;
