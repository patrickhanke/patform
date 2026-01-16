/**
 * Page Break Node
 */
import {
	$applyNodeReplacement,
	DecoratorNode,
	DOMExportOutput,
	LexicalNode,
	NodeKey,
	SerializedLexicalNode
} from "lexical";

export type SerializedPageBreakNode = SerializedLexicalNode;

export class PageBreakNode extends DecoratorNode<JSX.Element> {
	static getType(): string {
		return "page-break";
	}

	static clone(node: PageBreakNode): PageBreakNode {
		return new PageBreakNode(node.__key);
	}

	static importJSON(): PageBreakNode {
		return $createPageBreakNode();
	}

	exportJSON(): SerializedPageBreakNode {
		return {
			type: "page-break",
			version: 1
		};
	}

	createDOM(): HTMLElement {
		const div = document.createElement("div");
		div.className = "page-break";
		return div;
	}

	updateDOM(): false {
		return false;
	}

	exportDOM(): DOMExportOutput {
		const element = document.createElement("div");
		element.style.pageBreakAfter = "always";
		element.style.margin = "32px 0";
		element.style.borderBottom = "2px dashed #cbd5e0";
		element.style.padding = "16px 0";
		element.style.textAlign = "center";
		element.style.color = "#a0aec0";
		element.style.fontSize = "12px";
		element.textContent = "Page Break";
		return { element };
	}

	decorate(): JSX.Element {
		return (
			<div
				style={{
					pageBreakAfter: "always",
					margin: "32px 0",
					borderBottom: "2px dashed #cbd5e0",
					padding: "16px 0",
					textAlign: "center",
					color: "#a0aec0",
					fontSize: "12px"
				}}
			>
				Page Break
			</div>
		);
	}
}

export function $createPageBreakNode(): PageBreakNode {
	return $applyNodeReplacement(new PageBreakNode());
}

export function $isPageBreakNode(
	node: LexicalNode | null | undefined
): node is PageBreakNode {
	return node instanceof PageBreakNode;
}
