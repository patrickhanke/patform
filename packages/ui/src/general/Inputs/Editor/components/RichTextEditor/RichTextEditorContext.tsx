"use client";

import { createContext, useContext } from "react";
import type { Editor } from "@tiptap/react";

export type RichTextEditorContextValue = {
	editor: Editor | null;
	/** Bumped on every editor transaction so controls re-render with the active state. */
	version: number;
};

export const RichTextEditorContext =
	createContext<RichTextEditorContextValue | null>(null);

RichTextEditorContext.displayName = "RichTextEditorContext";

export function useRichTextEditorContext() {
	const context = useContext(RichTextEditorContext);

	if (!context) {
		throw new Error(
			"useRichTextEditorContext must be used within a RichTextEditor.Root"
		);
	}

	return context;
}
