import { ApolloRefetch, WebpageContent } from "@repo/types";
import { Dispatch, SetStateAction } from "react";

export type TableColumnEditContentProps = {
	initialData: WebpageContent[];
	onChange: (data: WebpageContent[]) => Promise<void>;
};

export type EditContentFieldProps = {
	initialField: WebpageContent;
	content: WebpageContent[];
	pageId: string;
	refetch: ApolloRefetch;
};

export type EditContentProps = {
	content: WebpageContent;
	setContent: Dispatch<SetStateAction<WebpageContent>>;
};
