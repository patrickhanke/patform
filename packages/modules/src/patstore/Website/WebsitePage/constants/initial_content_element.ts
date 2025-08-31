import { WebpageContent } from "@repo/types";
import { v4 as generateUuid } from "uuid";

const initial_content_element: WebpageContent = {
	name: "Neues Inhaltselement",
	position: 1,
	type: "text",
	id: generateUuid(),
	active: false,
	value: undefined
};

export default initial_content_element;
