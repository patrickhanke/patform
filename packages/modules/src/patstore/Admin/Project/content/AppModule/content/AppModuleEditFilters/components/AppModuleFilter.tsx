import { IconButton } from "@repo/ui";
import { AppModuleFilterProps } from "../types";

const AppModuleFilter = ({
	filter,
	setActiveFilter,
	deleteFilter
}: AppModuleFilterProps) => {
	return (
		<div>
			<div>
				<h3>{filter.label || filter.field}</h3>
				<span className="app_module_filter_meta">
					{filter.field} • {filter.type} • {filter.operator}
				</span>
			</div>
			<div className="button_container">
				<IconButton
					icon="edit"
					onClick={() => setActiveFilter(filter.id)}
				/>
				<IconButton
					icon="delete"
					onClick={() => deleteFilter(filter.id)}
				/>
			</div>
		</div>
	);
};

export default AppModuleFilter;
