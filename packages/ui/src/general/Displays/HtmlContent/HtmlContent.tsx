import clsx from "clsx";

const HtmlContent = ({ content }: { content: string }) => {
	return (
		<div className="html_content_container">
			<div
				className={clsx("html_content_container", "content_element")}
				dangerouslySetInnerHTML={{ __html: content }}
			/>
		</div>
	);
};

export default HtmlContent;
