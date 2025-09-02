import { Dispatch, SetStateAction } from "react";

export type SelectedImagesProps = {
	selectedImages: string[];
	setSelectedImages: Dispatch<SetStateAction<string[]>>;
	maxFileCount: number;
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

export type DisplaySelectedImagesProps = {
	id: string;
	image: {
		name: string;
		url: string;
	};
	name: string;
	maxFileCount: number;
	removeImageHandler: (t: string) => void;
};
