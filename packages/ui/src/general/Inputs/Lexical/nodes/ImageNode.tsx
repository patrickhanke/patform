/**
 * Image Node - Simplified version from Playground
 */
import {
	$applyNodeReplacement,
	DecoratorNode,
	DOMExportOutput,
	LexicalNode,
	NodeKey,
	SerializedLexicalNode,
	Spread
} from "lexical";

export interface ImagePayload {
	altText: string;
	src: string;
	key?: NodeKey;
	width?: number;
	height?: number;
	maxWidth?: number;
}

export type SerializedImageNode = Spread<
	{
		altText: string;
		src: string;
		width?: number;
		height?: number;
		maxWidth?: number;
	},
	SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<JSX.Element> {
	__src: string;
	__altText: string;
	__width: "inherit" | number;
	__height: "inherit" | number;
	__maxWidth: number;

	static getType(): string {
		return "image";
	}

	static clone(node: ImageNode): ImageNode {
		return new ImageNode(
			node.__src,
			node.__altText,
			node.__maxWidth,
			node.__width,
			node.__height,
			node.__key
		);
	}

	static importJSON(serializedNode: SerializedImageNode): ImageNode {
		const { altText, src, width, height, maxWidth } = serializedNode;
		const node = $createImageNode({
			altText,
			src,
			maxWidth,
			width,
			height
		});
		return node;
	}

	exportJSON(): SerializedImageNode {
		return {
			altText: this.getAltText(),
			src: this.getSrc(),
			width: this.__width === "inherit" ? 0 : this.__width,
			height: this.__height === "inherit" ? 0 : this.__height,
			maxWidth: this.__maxWidth,
			type: "image",
			version: 1
		};
	}

	constructor(
		src: string,
		altText: string,
		maxWidth: number,
		width?: "inherit" | number,
		height?: "inherit" | number,
		key?: NodeKey
	) {
		super(key);
		this.__src = src;
		this.__altText = altText;
		this.__maxWidth = maxWidth;
		this.__width = width || "inherit";
		this.__height = height || "inherit";
	}

	exportDOM(): DOMExportOutput {
		const element = document.createElement("img");
		element.setAttribute("src", this.__src);
		element.setAttribute("alt", this.__altText);
		if (this.__width !== "inherit") {
			element.style.width = `${this.__width}px`;
		}
		if (this.__height !== "inherit") {
			element.style.height = `${this.__height}px`;
		}
		return { element };
	}

	getSrc(): string {
		return this.__src;
	}

	getAltText(): string {
		return this.__altText;
	}

	createDOM(): HTMLElement {
		const span = document.createElement("span");
		span.className = "editor-image";
		return span;
	}

	updateDOM(): false {
		return false;
	}

	decorate(): JSX.Element {
		return (
			<img
				src={this.__src}
				alt={this.__altText}
				style={{
					maxWidth: this.__maxWidth || 500,
					width: this.__width !== "inherit" ? this.__width : undefined,
					height: this.__height !== "inherit" ? this.__height : undefined,
					display: "block",
					margin: "16px 0"
				}}
			/>
		);
	}
}

export function $createImageNode({
	altText,
	src,
	maxWidth = 500,
	width,
	height,
	key
}: ImagePayload): ImageNode {
	return $applyNodeReplacement(
		new ImageNode(src, altText, maxWidth, width, height, key)
	);
}

export function $isImageNode(
	node: LexicalNode | null | undefined
): node is ImageNode {
	return node instanceof ImageNode;
}
