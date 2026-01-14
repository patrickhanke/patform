"use client";

import siteStates from "./constants/siteStates";
import { Page } from "@repo/ui";

const EmailTemplate = () => {
	return (
		<Page
			title={"Email Template"}
			emptyContent={true}
			pageStates={siteStates}
		>
			<div>Email Template</div>
		</Page>
	);
};

export default EmailTemplate;
