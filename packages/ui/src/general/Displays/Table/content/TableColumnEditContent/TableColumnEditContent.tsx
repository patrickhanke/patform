import { CreateButton, Editor, SlideIn } from "@repo/ui";
import { FC, useCallback, useState } from "react";
import { WebpageContent } from "@repo/types";
import { useImmer } from "use-immer";
import { v4 } from "uuid";
import EditTeam from "./components/EditTeam";
import { TableColumnEditContentProps } from "./types";

const TableColumnEditContent: FC<TableColumnEditContentProps> = ({
	initialData,
	onChange
}) => {
	const [loading, setLoading] = useState(false);
	const [editTeam, setEditTeam] = useState(false);
	const [team, setTeam] = useImmer<WebpageContent>(
		initialData
			? initialData
			: { id: v4(), name: "", description: "", image: "" }
	);

	const slideInConfirmHandler = useCallback(async () => {
		setLoading(true);
		if (team) {
			await onChange(team);
		}

		setEditTeam(false);
		setLoading(false);
	}, [team]);

	return (
		<>
			<div className="button_container">
				{team?.id ? (
					<button
						className="full_button sm light"
						onClick={() => setEditTeam(true)}
					>
						{team.name}
					</button>
				) : (
					<button
						className="full_button sm grey"
						onClick={() => setEditTeam(true)}
					>
						+ Team hinzufügen
					</button>
				)}
			</div>
			<SlideIn
				cancel={() => setEditTeam(false)}
				confirm={() => slideInConfirmHandler()}
				isOpen={editTeam}
				header="Felder bearbeiten"
				showSecondaryContent={true}
				secondaryContent={
					<Editor
						label="Team Beschreibung"
						content={team?.description}
						onChange={(value) => {
							setTeam((draft) => {
								if (draft) {
									draft.description = value;
								}
							});
						}}
					/>
				}
				disabled={[loading, loading]}
			>
				<CreateButton
					text="Kategorie hinzufügen"
					size="small"
					onClick={() => {
						setCategories((draft) => {
							draft.push({
								...initialFieldValues,
								position: draft.length + 1,
								id: v4() as string
							});
						});
					}}
				/>
				<Divider size="small" showLine={false} />
				<DnDDisplay<Field[]>
					items={(sortItemsByPosition(categories) as Field[]) || []}
					ItemComponent={({ item }) => (
						<AppModuleField
							category={item as ModuleCategory}
							setActiveCategory={setActiveCategory}
						/>
					)}
					objectClass="Module"
					subField={{ id: moduleId, field: "categories" }}
				/>
			</SlideIn>
		</>
	);
};

export default TableColumnEditContent;
