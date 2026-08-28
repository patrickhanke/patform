"use client";

import { generateQueryFromFields, useFindData } from "@repo/provider";
import { useMemo, useState } from "react";
import {
	ApolloRefetch,
	Classes,
	Filter,
	LanguageValue,
	Module
} from "@repo/types";

function useFindModuleData<T extends Classes>({
	module,
	filters,
	limit,
	skip,
	order,
	additionalFields = [],
	defaultLanguage
}: {
	module?: Module;
	filters: Filter[];
	limit: number;
	skip: number;
	order?: string;
	additionalFields?: string[];
	defaultLanguage?: LanguageValue;
}): {
	loading: boolean;
	data?: T[];
	refetch: ApolloRefetch;
	count: number;
	language: LanguageValue | undefined;
	changeLanguage: (language: LanguageValue) => void;
} {
	const [language, setLanguage] = useState<LanguageValue | undefined>(
		defaultLanguage
	);
	const { loading, data, refetch, count } = useFindData({
		objectName: (module?.connected_class || "_User") as string,
		fields: [
			...generateQueryFromFields(module?.fields ?? []),
			...additionalFields,
			"data"
		],
		moduleId: module?.objectId,
		filters,
		limit,
		skip,
		order,
		skipQuery: !module?.connected_class,
		language
	});

	const changeLanguage = (language: LanguageValue) => {
		setLanguage(language);
		refetch();
	};

	const returnValue = useMemo(
		() => ({
			loading: !module || loading,
			data,
			refetch,
			count,
			language,
			changeLanguage
		}),
		[data, loading, module, language]
	);

	return returnValue;
}

export default useFindModuleData;
