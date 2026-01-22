import { ContentBlock, PatstoreSelectImages } from "@repo/ui";
import { axiosclient } from "@repo/provider";

const ImagePanel = ({
	selectedBlock,
	onChange
}: {
	selectedBlock: ContentBlock;
	onChange: (key: string, value: string) => void;
}) => {
	return (
		<>
			<div className="property-group">
				<label className="property-label">Bild URL</label>
				<PatstoreSelectImages
					image={selectedBlock.value || ""}
					maxFileCount={1}
					onChange={async (image: string) => {
						const response = await axiosclient().post(
							"functions/get_image_url",
							{
								image_id: image
							}
						);

						console.log({ response });
						const imageUrlResult = response.data.result;
						const imageTitle = response.data.result.title;
						console.log({ imageUrlResult });
						onChange("value", image);
						onChange("config.imageUrl", imageUrlResult.url);
						onChange("config.imageAlt", imageTitle);
					}}
				/>
			</div>

			<div className="property-group">
				<label className="property-label">Alt Text (Bildbeschreibung)</label>
				<input
					type="text"
					className="property-input"
					value={selectedBlock.config?.imageAlt || ""}
					onChange={(e) =>
						onChange("config.imageAlt", e.target.value)
					}
				/>
			</div>

			<div className="property-group">
				<label className="property-label">Ausrichtung</label>
				<select
					className="property-select"
					value={selectedBlock.config?.alignment || "center"}
					onChange={(e) =>
						onChange("config.alignment", e.target.value)
					}
				>
					<option value="left">Left</option>
					<option value="center">Center</option>
					<option value="right">Right</option>
				</select>
			</div>

			<div className="property-group">
				<label className="property-label">Breite</label>
				<input
					type="text"
					className="property-input"
					placeholder="e.g., 100%, 500px, auto"
					value={selectedBlock.config?.width || ""}
					onChange={(e) =>
						onChange("config.width", e.target.value)
					}
				/>
			</div>

			<div className="property-group">
				<label className="property-label">Höhe</label>
				<input
					type="text"
					className="property-input"
					placeholder="e.g., 300px, auto"
					value={selectedBlock.config?.height || ""}
					onChange={(e) =>
						onChange("config.height", e.target.value)
					}
				/>
			</div>

			<div className="property-group">
				<label className="property-label">Objekt Fit</label>
				<select
					className="property-select"
					value={selectedBlock.config?.objectFit || "cover"}
					onChange={(e) =>
						onChange("config.objectFit", e.target.value)
					}
				>
					<option value="contain">Contain</option>
					<option value="cover">Cover</option>
					<option value="fill">Fill</option>
					<option value="none">None</option>
					<option value="scale-down">Scale Down</option>
				</select>
			</div>
		</>
	);
};

export default ImagePanel;
