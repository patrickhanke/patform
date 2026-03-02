import React, { useCallback, useState } from "react";
import {
	CreateButton,
	DnDDisplay,
	SlideIn,
	sortItemsByPosition
} from "@repo/ui";
import { useImmer } from "use-immer";
import { v4 } from "uuid";
import { useDataHandler } from "@repo/provider";
import AppModuleFilter from "./components/AppModuleFilter";
import AppModuleEditFilter from "./components/AppModuleEditFilter";
import { AppModuleEditFiltersProps, ModuleFilter } from "./types";

const DEFAULT_FILTER: Omit<ModuleFilter, "id"> = {
	field: "",
	type: "String",
	operator: "equalTo",
	label: "Neuer Filter",
	position: 0
};

const AppModuleEditFilters = ({
	moduleId,
	initialFilters,
	modulePath
}: AppModuleEditFiltersProps) => {
	const { updateData } = useDataHandler(false, false);
	const [editFilters, setEditFilters] = React.useState(false);
	const [loading, setLoading] = useState(false);
	const [filters, setFilters] = useImmer<ModuleFilter[]>(
		initialFilters || []
	);
	const [activeFilter, setActiveFilter] = React.useState("");

	const slideInConfirmHandler = useCallback(async () => {
		setLoading(true);
		await updateData({
			className: "Module",
			objectId: moduleId,
			updateObject: {
				filters
			}
		});

		setEditFilters(false);
		setLoading(false);
	}, [filters, moduleId, updateData]);

	const findActiveFilter = useCallback(
		(id: string) => {
			return filters.find((f) => f.id === id);
		},
		[filters, activeFilter]
	);

	const deleteFilter = useCallback(
		(id: string) => {
			setFilters((draft) => draft.filter((f) => f.id !== id));
		},
		[setFilters]
	);

	return (
		<div>
			<button
				className="full_button sm green"
				onClick={() => setEditFilters(true)}
			>
				Filter bearbeiten
			</button>
			<SlideIn
				cancel={() => setEditFilters(false)}
				confirm={() => slideInConfirmHandler()}
				isOpen={editFilters}
				header="Filter bearbeiten"
				showSecondaryContent={!!activeFilter}
				secondaryContent={
					<AppModuleEditFilter
						filter={findActiveFilter(activeFilter)}
						setFilters={setFilters}
						modulePath={modulePath}
					/>
				}
				loading={loading}
				disabled={[loading, loading]}
			>
				<div>
					<div>
						<CreateButton
							text="Filter hinzufügen"
							size="medium"
							onClick={() => {
								setFilters((draft) => {
									draft.push({
										...DEFAULT_FILTER,
										id: v4(),
										position: draft.length + 1
									} as ModuleFilter);
								});
							}}
						/>
					</div>
					<div>
						<DnDDisplay<ModuleFilter[]>
							items={
								(sortItemsByPosition(
									filters.map((f, i) => ({
										...f,
										position: f.position ?? i
									}))
								) as ModuleFilter[]) || []
							}
							ItemComponent={({ item }) => (
								<AppModuleFilter
									filter={item as ModuleFilter}
									setActiveFilter={setActiveFilter}
									deleteFilter={deleteFilter}
								/>
							)}
							onChange={(newItems) =>
								setFilters(
									newItems.map((f, i) => ({
										...f,
										position: i + 1
									}))
								)
							}
						/>
					</div>
				</div>
			</SlideIn>
		</div>
	);
};

export default AppModuleEditFilters;
