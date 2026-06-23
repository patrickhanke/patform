"use client";

import siteStates from "./constants/siteStates";
import { FormActionBar, Loader, Page } from "@repo/ui";
import { useCallback, useMemo, useState } from "react";
import { Params, ApolloRefetch } from "@repo/types";
import { useDataHandler } from "@repo/provider";
import { isEqual } from "lodash-es";
import { ListSettings, ListMembers, ListFilter } from "./content";
import useListData from "./hooks/useListData";

const List = ({ params }: { params: Params }) => {
	const listId = params.list_id;
	const { updateData } = useDataHandler();
	const [siteState, setSiteState] = useState<(typeof siteStates)[number]>(
		siteStates[0] as { value: string; label: string }
	);
	const [saving, setSaving] = useState(false);

	const {
		list,
		savedList,
		onListChange,
		resetList,
		commitList,
		users,
		refetchList,
		refetchUsers,
		userModule,
		loading
	} = useListData(listId);

	const hasUnsavedChanges = useMemo(() => {
		if (!list || !savedList) {
			return false;
		}

		return !isEqual(list, savedList);
	}, [list, savedList]);

	const handleSave = useCallback(async () => {
		if (!list) {
			return;
		}

		setSaving(true);

		await updateData({
			className: "List",
			objectId: listId,
			updateObject: {
				title: list.title,
				settings: list.settings,
				filters: list.settings?.filters ?? list.filters ?? []
			},
			feedback: "Liste erfolgreich gespeichert"
		});

		commitList(list);
		await refetchList();
		setSaving(false);
	}, [list, listId, updateData, commitList, refetchList]);

	const handleReset = useCallback(() => {
		resetList();
	}, [resetList]);

	const refetch = useCallback(async () => {
		await refetchList();
		await refetchUsers();
	}, [refetchList, refetchUsers]);

	const pageTitle = useMemo(() => list?.title || "Lädt ...", [list?.title]);

	if (loading || !list) {
		return <Loader width="100%" height="100%" />;
	}

	return (
		<Page
			title={pageTitle}
			emptyContent={true}
			refetch={refetch as unknown as ApolloRefetch}
			pageStates={siteStates}
			pageState={siteState}
			setPageState={setSiteState}
		>
			{siteState.value === "settings" && (
				<ListSettings
					list={list}
					onListChange={onListChange}
					disabled={saving}
				/>
			)}
			{siteState.value === "filter" && (
				<ListFilter
					list={list}
					users={users}
					userModule={userModule}
					onListChange={onListChange}
					disabled={saving}
				/>
			)}
			{siteState.value === "members" && (
				<ListMembers
					list={list}
					users={users}
					refetchUsers={refetchUsers}
					disabled={saving}
				/>
			)}
			<FormActionBar
				open={hasUnsavedChanges}
				setOpen={() => undefined}
				handleSubmit={() => {
					void handleSave();
				}}
				resetForm={() => {
					handleReset();
				}}
			/>
		</Page>
	);
};

export default List;
