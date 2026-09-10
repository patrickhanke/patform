"use client";

import { ContentBlock } from "../../ContentEditor";
import "./styles.scss";

interface SpacerBlockProps {
	block: ContentBlock;
}

export default function SpacerBlock({ block }: SpacerBlockProps) {
	const height = block.config?.spacerHeight || "24px";

	return (
		<div className="spacer-block" style={{ height }} aria-hidden="true">
			<span className="spacer-block-label">Abstand {height}</span>
		</div>
	);
}
