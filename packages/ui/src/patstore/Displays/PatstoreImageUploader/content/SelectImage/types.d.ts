import { ApolloRefetch, Filter, ImageClass } from "@repo/types";
import { Dispatch, SetStateAction } from "react";

export type SelectImageProps = {
	maxFileCount: number;
	selectedImages: string[];
	setSelectedImages: Dispatch<SetStateAction<string[]>>;
};

export type UseFindImagesHook = (T: {
	moduleId: string;
	filters: Filter[];
	limit?: number;
	skip?: number;
}) => {
	images: ImageClass[];
	refetch: ApolloRefetch;
	count: number;
	loading: boolean;
};

export type PaginationHandlersProps = {
	pagination: PaginationState;
	setPagination: (
		updater: (prev: PaginationState) => PaginationState
	) => void;
	pageCount: number;
	pageIndex: number;
	previousPage: () => void;
	nextPage: () => void;
	firstPage: () => void;
	lastPage: () => void;
	canGetPreviousPage: boolean;
	canGetNextPage: boolean;
};

export type DisplayImageElementProps = {
	filePath: string;
	name: string;
};

export type ImageUploaderProps = {
	onChange: (
		V: { filePath: string; fileName: string }[]
	) => void | Promise<void>;
	maxFileCount: number;
};

export type SelectImagesInterfaceProps = {
	selectedImages: string[];
	setSelectedImages: Dispatch<SetStateAction<string[]>>;
	maxFileCount: number;
	moduleId: string;
};
