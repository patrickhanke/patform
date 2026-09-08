"use client";

import { InfoBox, Loader, Page } from "@repo/ui";
import { useContext, useMemo, useState } from "react";
import { PatstoreAppContext, useGetData } from "@repo/provider";
import { ListSettings, ListMembers, ListFilter } from "./content";
import { useParams } from "next/navigation";
import { EmailList, Module, PageState } from "@repo/types";

const List = () => {
	const { modules } = useContext(PatstoreAppContext);

	const { list_id: listId } = useParams<{ list_id: string }>();

	const {
		data: list,
		refetch,
		loading
	} = useGetData<EmailList>({
		objectName: "Email",
		fields: [
			"objectId",
			"title",
			"data",
			"settings",
			"filters",
			"type",
			"project { objectId name }"
		],
		id: listId
	});

	const pageTitle = useMemo(() => list?.title || "Lädt ...", [list?.title]);

	const userModule = useMemo(
		() =>
			modules.find((module) => module.path === "/users") as
				| Module
				| undefined,
		[modules]
	);

	const disabledButton = useMemo(() => {
		const buttons = {
			settings: false,
			filter: false,
			members: false
		};
		if (list?.type === "static_list") {
			buttons.filter = true;
		} else {
			if (list?.settings?.static_list) {
				buttons.filter = true;
			}
			if (list?.settings?.include_all_users) {
				buttons.members = true;
				buttons.filter = true;
			}
			if (list?.settings?.filters) {
				buttons.members = true;
			}
		}
		return buttons;
	}, [list]);

	const pageStates: PageState[] = useMemo(
		() => [
			{
				value: "settings",
				label: "Einstellungen"
			},
			{
				value: "filter",
				label: "Filter",
				disabled: disabledButton.filter
			},
			{
				value: "members",
				label: "Mitglieder",
				disabled: disabledButton.members
			}
		],
		[list]
	);

	const [siteState, setSiteState] = useState<PageState>(
		pageStates[0] as { value: string; label: string }
	);

	if (loading || !list) {
		return <Loader width="100%" height="100%" />;
	}

	return (
		<Page
			title={`${pageTitle} - ${siteState.label}`}
			description={""}
			emptyContent={true}
			refetch={refetch}
			pageStates={pageStates}
			pageState={siteState}
			setPageState={setSiteState}
		>
			{list.type === "static_list" && (
				<InfoBox
					status="info"
					text="Diese Liste ist statisch und kann nicht bearbeitet werden. Sie kann von Benutzern abonniert werden."
				/>
			)}
			{siteState.value === "settings" && (
				<ListSettings
					list={list}
					disabled={list.type === "static_list"}
				/>
			)}
			{siteState.value === "filter" && (
				<ListFilter list={list} userModule={userModule} />
			)}
			{siteState.value === "members" && userModule && (
				<ListMembers
					list={list}
					userModule={userModule}
					staticList={list.type === "static_list"}
				/>
			)}
		</Page>
	);
};

export default List;
