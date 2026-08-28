import { ContentClass, WebpageComponentFaq } from "@repo/types";
import { SetPageData } from "@repo/ui";

export type EditFAQProps = {
	initialData?: ContentClass["data"];
	objectId: string;
};

export type EditFaqSettingsProps = {
	data: WebpageComponentFaq;
	setData: SetPageData<WebpageComponentFaq>;
};
