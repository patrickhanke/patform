const pageStyle = `
@page { size: 29.7cm 21cm portrait; margin-top: 0.8cm; margin-bottom: 0.8cm; margin-left: 1cm; margin-right: 1cm; }
html, body {
	height: auto !important;
	overflow: visible !important;
	margin: 0;
	background: #fff;
	-webkit-print-color-adjust: exact;
	print-color-adjust: exact;
}
`;

const rulesFrom = (sheet: CSSStyleSheet) => {
	try {
		return Array.from(sheet.cssRules)
			.map((rule) => rule.cssText)
			.join("\n");
	} catch {
		return "";
	}
};

const collectCss = () => {
	const sheets = [
		...Array.from(document.styleSheets),
		...Array.from(document.adoptedStyleSheets ?? [])
	];
	return sheets.map((sheet) => rulesFrom(sheet)).join("\n");
};

export const printGameCards = (node: HTMLElement | null, title = "Spielkarten") => {
	if (!node) return;

	const iframe = document.createElement("iframe");
	iframe.setAttribute("data-game-cards-print", "true");
	iframe.setAttribute("aria-hidden", "true");
	iframe.style.position = "fixed";
	iframe.style.left = "-10000px";
	iframe.style.top = "0";
	iframe.style.width = "21cm";
	iframe.style.height = "29.7cm";
	iframe.style.border = "0";
	document.body.appendChild(iframe);

	const frameWindow = iframe.contentWindow;
	const doc = frameWindow?.document;
	if (!frameWindow || !doc) {
		iframe.remove();
		return;
	}

	doc.open();
	doc.write("<!DOCTYPE html><html><head></head><body></body></html>");
	doc.close();
	doc.title = title;

	const style = doc.createElement("style");
	style.textContent = `${collectCss()}\n${pageStyle}`;
	doc.head.appendChild(style);

	const clone = node.cloneNode(true) as HTMLElement;
	clone.style.display = "block";
	clone.style.position = "static";
	clone.style.visibility = "visible";
	clone.style.width = "100%";
	clone.style.height = "auto";
	clone.style.overflow = "visible";
	clone.style.background = "#fff";
	doc.body.appendChild(clone);

	const remove = () => iframe.remove();
	frameWindow.addEventListener("afterprint", remove, { once: true });

	const images = Array.from(doc.images);
	const ready =
		images.length === 0
			? Promise.resolve()
			: Promise.all(
					images.map(
						(image) =>
							new Promise<void>((resolve) => {
								if (image.complete) {
									resolve();
									return;
								}
								image.addEventListener("load", () => resolve(), {
									once: true
								});
								image.addEventListener("error", () => resolve(), {
									once: true
								});
							})
					)
				);
	void ready.then(() => {
		frameWindow.focus();
		frameWindow.print();
	});
};
