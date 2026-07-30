"use client";

import { PageHeader } from "./content/PageHeader";
import { PageProps } from "./types";
import styles from "./Page.module.scss";

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
			<div className={styles.page_header_container}>
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
			<div className={styles.page_content} id="content">
				{children}
			</div>
		</>
	);
};

export default Page;
