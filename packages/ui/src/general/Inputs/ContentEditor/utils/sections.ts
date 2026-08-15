import { v4 as uuidv4 } from "uuid";
import type { ContentBlock, SectionHtmlTag } from "../ContentEditor";

export const SECTION_HTML_TAGS: SectionHtmlTag[] = [
	"section",
	"article",
	"aside",
	"nav",
	"header",
	"footer",
	"main",
	"div"
];

export const createSectionBlock = (
	htmlTag: SectionHtmlTag = "section",
	innerBlocks: ContentBlock[] = []
): ContentBlock => ({
	id: uuidv4(),
	name: htmlTag.charAt(0).toUpperCase() + htmlTag.slice(1),
	type: "section",
	position: 1,
	active: true,
	value: "",
	children: [innerBlocks],
	config: {
		htmlTag
	}
});

export const isSectionDocument = (blocks: ContentBlock[]): boolean =>
	blocks.length > 0 && blocks.every((block) => block.type === "section");

export const getSectionInnerBlocks = (
	section: ContentBlock | undefined
): ContentBlock[] => {
	if (!section?.children?.length) return [];
	return section.children[0] || [];
};

export const normalizeToSections = (
	content: ContentBlock[] | undefined
): ContentBlock[] => {
	const blocks = content || [];

	if (blocks.length === 0) {
		return [createSectionBlock("section")];
	}

	if (isSectionDocument(blocks)) {
		return blocks.map((section, index) => ({
			...section,
			position: index + 1,
			children:
				section.children && section.children.length > 0
					? section.children
					: [[]],
			config: {
				...section.config,
				htmlTag: section.config?.htmlTag || "section"
			}
		}));
	}

	// Legacy flat documents → wrap in one default <section>
	return [createSectionBlock("section", blocks)];
};

/** Flatten section wrappers back to a flat block list (email / single-section mode). */
export const flattenSections = (blocks: ContentBlock[]): ContentBlock[] => {
	if (!isSectionDocument(blocks)) {
		return blocks;
	}

	return blocks
		.flatMap((section) => getSectionInnerBlocks(section))
		.map((block, index) => ({
			...block,
			position: index + 1
		}));
};

export const getSectionDroppableId = (sectionId: string) =>
	`column-${sectionId}-0`;

export const findBlockById = (
	blockList: ContentBlock[],
	id: string
): ContentBlock | null => {
	if (!blockList) return null;

	for (const block of blockList) {
		if (block.id === id) return block;
		if (block.children) {
			for (const column of block.children) {
				const found = findBlockById(column, id);
				if (found) return found;
			}
		}
	}
	return null;
};
