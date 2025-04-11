import { WebpageContent } from "@repo/types";

export type TableColumnEditContentProps = {
	initialData: WebpageContent;
	onChange: (data: WebpageContent) => Promise<void>;
};
