"use client";

import styles from "./Page.module.scss";
import { PageSkeletonProps } from "./types";
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
			<div className={styles.page_header_container}>
				<PageHeaderSkeleton
					title={title}
					description={description}
					pageHeaderButtons={pageHeaderButtons}
					pageStates={pageStates}
					pageHeaderContent={pageHeaderContent}
					createClass={createClass}
				/>
			</div>
			<div className={styles.page_content} id="content">
				<div />
			</div>
		</>
	);
};

export default PageSkeleton;
