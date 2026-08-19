import { ContentClass } from "@repo/types";

export type ComponentContentProps = {
	objectId: string;
	data: ContentClass["data"];
	type: ContentClass["type"];
};
