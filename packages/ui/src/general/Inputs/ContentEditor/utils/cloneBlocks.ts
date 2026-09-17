import { v4 as uuidv4 } from "uuid";
import type { ContentBlock } from "../ContentEditor";

/** Deep-clone blocks and assign fresh ids (including nested layout/section children). */
export const cloneBlocksWithNewIds = (
	blockList: ContentBlock[]
): ContentBlock[] =>
	blockList.map((block) => {
		const cloned: ContentBlock = structuredClone(block);
		cloned.id = uuidv4();
		if (cloned.children) {
			cloned.children = cloned.children.map((column) =>
				cloneBlocksWithNewIds(column)
			);
		}
		return cloned;
	});
