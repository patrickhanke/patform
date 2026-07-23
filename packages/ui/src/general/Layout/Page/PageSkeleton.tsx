"use client";

import { PageSkeletonProps } from "./types";
import "./styles.scss";
import { PageHeaderSkeleton } from "./content";

const PageSkeleton = ({
	title,
	description,
	pageHeaderButtons,
	pageStates,
	pageHeaderContent,
	createClass
}: PageSkeletonProps) => {
	return (
		<>
			<div className="page_header_container">
				<PageHeaderSkeleton
					title={title}
					description={description}
					pageHeaderButtons={pageHeaderButtons}
					pageStates={pageStates}
					pageHeaderContent={pageHeaderContent}
					createClass={createClass}
				/>
			</div>
			<div className="page-content" id="content">
				<div />
			</div>
		</>
	);
};

export default PageSkeleton;
