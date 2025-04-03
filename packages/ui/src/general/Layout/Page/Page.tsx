"use client";

import { PageHeader } from "./content/PageHeader";
import { PageProps } from "./types";
import "./styles.scss";

const Page = ({
	title,
	description,
	children,
	pageHeaderButtons,
	pageStates = [],
	pageState,
	setPageState,
	pageHeaderContent,
	createClass,
	refetch,
	emptyContent = false
}: PageProps) => {
	return (
		<>
			<div className="page_header_container">
				<PageHeader
					title={title}
					description={description}
					pageHeaderButtons={pageHeaderButtons}
					pageStates={pageStates}
					pageState={pageState}
					setPageState={setPageState}
					pageHeaderContent={pageHeaderContent}
					createClass={createClass}
					refetch={refetch}
					emptyContent={emptyContent}
				/>
			</div>
			<div className="page-content" id="content">
				{children}
			</div>
		</>
	);
};

export default Page;
