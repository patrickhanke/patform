"use client";

import { Lexical, Page } from "@repo/ui";
import { FC, useContext, useState } from "react";

import { PatstoreAppContext } from "@repo/provider";
import { EmailContentProps } from "./types";

const EmailContent: FC<EmailContentProps> = ({ data, refetch }) => {
	const { currentModule, user } = useContext(PatstoreAppContext);
	const [content, setContent] = useState<string>("");

	console.log({ content });

	return (
		<Page
			title={`${currentModule.name} - Inhalte`}
			description="Übersicht über alle Inhalte"
			emptyContent={true}
			// pageHeaderButtons={user?.is_superuser ? pageHeaderButtons : []}
		>
			<Lexical
				value={data?.content || ""}
				onChange={(value) => setContent(value)}
				withInsertMenu={true}
				withToolbar={true}
				withFloatingToolbar={true}
				withCodeHighlight={true}
				withCharacterCount={true}
				withTreeView={true}
				autoFocus={true}
				maxLength={1000}
			/>
		</Page>
	);
};

export default EmailContent;
