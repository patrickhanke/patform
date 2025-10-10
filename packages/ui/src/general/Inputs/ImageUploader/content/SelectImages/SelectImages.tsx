import React, { useContext, useState } from "react";
import { useCreateColumns } from "@repo/ui";
import { Filter, ImageClass } from "@repo/types";
import useGetImages from "./hooks/useGetImages";
import { PatstoreAppContext } from "../../../../../../../provider/src/patstore";

const SelectImages = () => {
	const { project } = useContext(PatstoreAppContext);
	const [filters, setFilters] = useState<Filter[]>([]);
	const { images, refetch } = useGetImages({
		moduleId: currentModule.objectId,
		filters
	});

	const columns = useCreateColumns<ImageClass>({
		data: [
			{ id: "filePath", type: "image", label: "Vorschau" },
			{ id: "date", type: "date", label: "Datum" },
			{ id: "title", type: "edit_string", label: "Name" }
		],
		fields: currentModule.fields,
		className: "Image",
		refetch,
		categories: currentModule?.categories
	});

	return (
		<div>
			<RenderFilters
				categories={currentModule.categories}
				filters={filters}
				setFilters={setFilters}
				initialFilters={[]}
				fields={[]}
			/>
			<Separator size="xs" noLine />
			<Table columns={columns} data={images || []} />
		</div>
	);
};

export default SelectImages;
