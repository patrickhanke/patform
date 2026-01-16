/**
 * Example usage of the Lexical Editor with Insert Menu
 */
import React, { useState } from "react";
import { Lexical } from "./Lexical";

export default function LexicalExample() {
	const [content, setContent] = useState("");

	return (
		<div style={{ padding: "20px" }}>
			<h2>Lexical Editor with Insert Menu</h2>
			
			<Lexical
				value={content}
				onChange={setContent}
				placeholder="Start typing... Click + Insert to add content!"
				withToolbar={true}
				withInsertMenu={true}  // ⚠️ IMPORTANT: Enable Insert Menu
				withFloatingToolbar={false}
				withCodeHighlight={true}
			/>

			<div style={{ marginTop: "20px" }}>
				<h3>Output HTML:</h3>
				<pre style={{ 
					background: "#f4f4f4", 
					padding: "10px", 
					borderRadius: "4px",
					maxHeight: "200px",
					overflow: "auto"
				}}>
					{content}
				</pre>
			</div>
		</div>
	);
}
