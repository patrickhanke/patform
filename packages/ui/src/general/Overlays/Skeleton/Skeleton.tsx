import { FC } from "react";
import { SkeletonProps } from "./types";
import { Page } from "../../Layout";
import { Loader } from "@chakra-ui/react";

const Skeleton: FC<SkeletonProps> = ({ type, headButtons }) => {
	if (type === "overview") {
		return (
			<Page title="lädt..." emptyContent>
				<Loader width="170px" height="34px" />
			</Page>
		);
	}
	return (
		<Page title="lädt..." emptyContent>
			<Loader width="170px" height="34px" />
		</Page>
	);
};

export default Skeleton;
