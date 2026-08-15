import { PageState } from "@repo/types";

const page_states: readonly PageState[] = [
	{
		value: "settings",
		label: "Einstellungen",
		disabled: false
	},
	{
		value: "content",
		label: "Inhalte",
		disabled: false
	},
	{
		value: "seo",
		label: "SEO",
		disabled: true
	}
] as const;

export default page_states;
