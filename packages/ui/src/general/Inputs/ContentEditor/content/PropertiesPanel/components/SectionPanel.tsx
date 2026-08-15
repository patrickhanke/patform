import { ContentBlock, SectionHtmlTag } from "../../../ContentEditor";
import { SECTION_HTML_TAGS } from "../../../utils/sections";

const SectionPanel = ({
	selectedBlock,
	onChange
}: {
	selectedBlock: ContentBlock;
	onChange: (key: string, value: string) => void;
}) => {
	return (
		<div className="property-group">
			<label className="property-label">HTML-Tag</label>
			<select
				className="property-select"
				value={selectedBlock.config?.htmlTag || "section"}
				onChange={(e) =>
					onChange("config.htmlTag", e.target.value as SectionHtmlTag)
				}
			>
				{SECTION_HTML_TAGS.map((tag) => (
					<option key={tag} value={tag}>
						{tag}
					</option>
				))}
			</select>
		</div>
	);
};

export default SectionPanel;
