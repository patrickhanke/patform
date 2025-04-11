import { ModuleCategory } from "@repo/types";

export type WebsitePagesProps = {
	moduleId: string;
	categories: ModuleCategory[];
	refetchTrigger?: boolean;
};
