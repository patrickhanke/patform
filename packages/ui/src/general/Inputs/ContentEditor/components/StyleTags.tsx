"use client";

import type { ContentBlockStyle } from "../styles";
import "./StyleTags.scss";

const buildStyleTags = (style?: ContentBlockStyle): string[] => {
	if (!style) return [];

	const tags: string[] = [];

	if (style.padding) tags.push(`padding:${style.padding}`);
	if (style.margin) tags.push(`margin:${style.margin}`);
	if (style.backgroundColor) tags.push(`bg:${style.backgroundColor}`);
	if (style.color) tags.push(`color:${style.color}`);

	const flex = style.flex;
	if (flex) {
		if (flex.alignItems) tags.push(`align:${flex.alignItems}`);
		if (flex.justifyContent) tags.push(`justify:${flex.justifyContent}`);
		if (flex.gap) tags.push(`gap:${flex.gap}`);
		if (flex.wrap) tags.push("wrap");
		if (flex.changeToColumn) tags.push("column-mobile");
	}

	return tags;
};

export default function StyleTags({
	style,
	extraTags = []
}: {
	style?: ContentBlockStyle;
	/** e.g. section html tag badge content without brackets */
	extraTags?: string[];
}) {
	const tags = [...extraTags, ...buildStyleTags(style)];

	if (tags.length === 0) return null;

	return (
		<div className="content-style-tags">
			{tags.map((tag) => (
				<span key={tag} className="content-style-tag">
					&lt;{tag}&gt;
				</span>
			))}
		</div>
	);
}
