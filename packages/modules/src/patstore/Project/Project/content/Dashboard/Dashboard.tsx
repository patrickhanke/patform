"use client";

import { useEffect, useState } from "react";
import { ActionBar, Editor } from "@repo/ui";
import { isEqual } from "lodash-es";

const Dashboard = ({
	content,
	onChange
}: {
	content: string;
	onChange: (content: string) => void;
}) => {
	const [editorContent, setEditorContent] = useState<string>(content);
	const [open, setOpen] = useState<boolean>(false);

	useEffect(() => {
		console.log(isEqual(editorContent, content));
		if (!isEqual(editorContent, content)) {
			setOpen(true);
		}
	}, [editorContent]);

	return (
		<div>
			<Editor
				content={editorContent}
				onChange={(value) => setEditorContent(value)}
			/>
			<ActionBar
				open={open}
				onSave={() => {
					onChange(editorContent);
					setOpen(false);
				}}
				onCancel={() => {
					setEditorContent(content);
					setOpen(false);
				}}
			/>
		</div>
	);
};

export default Dashboard;
