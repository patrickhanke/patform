import { ContentClass } from "@repo/types";
import { usePageData, StatelessToggle, TextInput } from "@repo/ui";

const EmailComponentSettings = ({
	componentId,
	active,
	title
}: {
	componentId: string;
	active: boolean;
	title: string;
}) => {
	const { data, setData } = usePageData<Partial<ContentClass>>(
		{
			objectId: componentId,
			initialData: {
				active: active || false,
				title: title || ""
			}
		},
		{
			className: "Content",
			message: "Komponenten Einstellungen aktualisiert",
			updateObject: (currentData) => ({
				active: currentData.active,
				title: currentData.title
			})
		}
	);

	return (
		<div>
			<div className="flex row a-ce j-sb gap-sm">
				<div className="flex col a-st">
					<label>Aktiv</label>
					<p>Die Komponente ist aktiv.</p>
				</div>
				<StatelessToggle
					value={data?.active || false}
					onChange={(value) => setData("active", value)}
				/>
			</div>
			<div className="flex row a-ce j-sb gap-sm">
				<div className="flex col a-st">
					<label>Titel</label>
					<p>Der Titel der Komponente.</p>
				</div>
				<TextInput
					id="title"
					defaultValue={data?.title || ""}
					onChange={(value) => setData("title", value)}
				/>
			</div>
		</div>
	);
};

export default EmailComponentSettings;
