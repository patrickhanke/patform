import React from "react";
import { Loader } from "@repo/ui";

type PageHeaderSkeletonProps = {
	title?: string;
	pageHeaderButtons?: number;
	description?: boolean;
	pageHeaderContent?: React.ReactNode;
	createClass?: boolean;
	pageStates?: number;
};

const PageHeaderSkeleton = ({
	title,
	pageHeaderButtons,
	description,
	pageHeaderContent,
	createClass,
	pageStates
}: PageHeaderSkeletonProps) => {
	return (
		<>
			<div className="page_header_container">
				<div className="pageheader_content">
					<div className={"pageheader_content_container"}>
						<div>
							{title ? (
								<h2>{title}</h2>
							) : (
								<Loader width="170px" height="34px" />
							)}
							{description && (
								<Loader width="240px" height="18px" />
							)}
						</div>
						<div className="button_container">
							{pageHeaderButtons && (
								<div className={"pageheader_button_container"}>
									{Array.from(
										{ length: pageHeaderButtons },
										(_value: number, index: number) => (
											<Loader
												width="120px"
												height="12px"
												key={index.toString()}
											/>
										)
									)}
								</div>
							)}
							{pageHeaderContent && (
								<>
									<Loader width="120px" height="12px" />
								</>
							)}
							{createClass && (
								<Loader width="120px" height="12px" />
							)}
						</div>
					</div>
					{pageStates &&
						Array.from({ length: pageStates }, (value: number) => (
							<Loader width="180px" height="48px" key={value} />
						))}
				</div>
			</div>
		</>
	);
};

export default PageHeaderSkeleton;
