import { WebpageContent } from "@repo/types";
import { Dispatch, SetStateAction } from "react";

export type TableColumnEditContentProps = {
	initialData: WebpageContent[];
	onChange: (data: WebpageContent[]) => Promise<void>;
};

export type EditContentFieldProps = {
	field: WebpageContent;
	setActiveIndex: Dispatch<SetStateAction<number>>;
};

export type EditContentProps = {
	content: WebpageContent[];
	setContent: Dispath<SetStateAction<WebpageContent[]>>;
	activeIndex: number;
};
