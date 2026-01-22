"use client";

import siteStates from "./constants/siteStates";
import { Page } from "@repo/ui";
import { useEffect, useMemo, useState } from "react";
import { Params } from "@repo/types";
import { useGetData } from "@repo/provider";
import { ListSettings, ListMembers } from "./content";

const List = ({ params }: { params: Params }) => {
	const listId = params.list_id;

	const { data: list, refetch } = useGetData({
		objectName: "Item",
		fields: ["objectId", "title", "data", "settings"],
		id: listId
	});

	const [siteState, setSiteState] = useState<(typeof siteStates)[number]>(
		siteStates[0] as { value: string; label: string }
	);

	if (!list) {
		return <div>Lädt ...</div>;
	}

	return (
		<Page
			title={list ? list?.title : "Lädt ..."}
			emptyContent={true}
			refetch={refetch}
			pageStates={siteStates}
			pageState={siteState}
			setPageState={setSiteState}
		>
			{!list ? (
				<p>Liste nicht gefunden</p>
			) : (
				<>
					{siteState.value === "settings" && (
						<ListSettings
							listId={listId}
							onStaticListChange={() => {
								// Refetch to update the list data
								refetch();
							}}
						/>
					)}
					{siteState.value === "members" && (
						<ListMembers listId={listId} refetch={refetch} />
					)}
				</>
			)}
		</Page>
	);
};

export default List;
