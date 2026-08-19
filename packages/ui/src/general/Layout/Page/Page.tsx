"use client";

import { PageHeader } from "./content/PageHeader";
import { PageProps } from "./types";
import styles from "./Page.module.scss";
import { usePageData } from "@repo/ui";
import { PageActionBar } from "./content";

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
	const { dataHasChanged, resetData, undo, redo, updateOptions, objectId } =
		usePageData();
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
			<PageActionBar
				open={dataHasChanged}
				updateOptions={updateOptions}
				objectId={objectId}
				resetData={resetData}
				undoData={undo}
				redoData={redo}
				refetch={refetch}
			/>
		</>
	);
};

export default Page;
