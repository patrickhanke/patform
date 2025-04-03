"use client";

import React, { Suspense, useContext, useEffect, useMemo } from "react";
import useGetTickets from "./hooks/useGetTickets";
import styles from "./Tickets.module.scss";
import { useDataHandler } from "@repo/provider";
import { TicketsComponent } from "./types";
import clsx from "clsx";
import { useSearchParams } from "next/navigation";
import SiteHeaderContent from "./components/SiteHeaderContent";
import { Filter } from "@repo/types";
import { useCallback, useState } from "react";
import useTicketColumns from "./hooks/useTicketColumns";
import { Page, Table } from "@repo/ui";
import { PatflowAppContext, NotificationContext } from "@repo/provider";

const Tickets = ({ id, className, pageState = "open" }: TicketsComponent) => {
	const [filters, setFilters] = React.useState([] as Filter[]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 20
	});
	const { tickets, refetch, count } = useGetTickets({
		id,
		className,
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize
	});
	const searchParams = useSearchParams();
	const { updateData, deleteData } = useDataHandler();
	const { refetchTicket } = useContext(PatflowAppContext);
	const { newNotification } = useContext(NotificationContext);

	const archiveTicket = useCallback(async (objectId: string) => {
		await updateData({
			className: "Ticket",
			objectId,
			updateObject: {
				archived: true
			}
		});
		refetch();
	}, []);

	const deleteTicket = useCallback(async (objectId: string) => {
		await deleteData({
			className: "Ticket",
			objectId
		});
		refetch();
	}, []);

	const columns = useTicketColumns({ refetch, archiveTicket, deleteTicket });

	const initialFilters: () => Filter[] = useCallback(() => {
		const filterArray: Filter[] = [];
		if (pageState === "open") {
			filterArray.push({
				key: "state",
				value: "open",
				operator: "_in",
				id: "state"
			});
		} else if (pageState === "in_progress") {
			filterArray.push({
				key: "state",
				value: "in_progress",
				operator: "_eq",
				id: "state"
			});
		} else if (pageState === "closed") {
			filterArray.push({
				key: "state",
				value: "closed",
				operator: "_eq",
				id: "state"
			});
		}
		if (searchParams.get("ticket")) {
			filterArray.push({
				key: "objectId",
				value: searchParams.get("ticket") as string,
				operator: "_eq",
				id: "objectId"
			});
		}
		return filterArray;
	}, [pageState, searchParams.get("ticket")]);

	const siteContent = useMemo(() => {
		const content = {
			title: "Tickets",
			description: ""
		};
		if (pageState === "open") {
			content.title = "Aktive Tickets";
			content.description =
				"Hier finden Sie alle Tickets, die noch nicht erledigt sind.";
		} else if (pageState === "in_progress") {
			content.title = "Ausgeführte Tickets";
			content.description = "Hier finden Sie alle ausgeführten Tickets.";
		} else if (pageState === "closed") {
			content.title = "Erledigte Tickets";
			content.description = "Hier finden Sie alle erledigten Tickets.";
		} else if (pageState === "archived") {
			content.title = "Archivierte Tickets";
			content.description = "Hier finden Sie alle archivierten Tickets.";
		}

		return content;
	}, [pageState]);

	useEffect(() => {
		setFilters(initialFilters());
	}, [searchParams.get("ticket"), pageState]);

	useEffect(() => {
		if (refetchTicket) {
			refetch();
		}
	}, [refetchTicket]);

	useEffect(() => {
		if (newNotification) {
			refetch();
		}
	}, [newNotification]);

	const siteHeaderContent = useMemo(
		() => (
			<Suspense fallback={<div>Loading...</div>}>
				<SiteHeaderContent
					id={id}
					filters={filters}
					setFilters={setFilters}
					initialFilters={initialFilters}
					tickets={tickets || []}
				/>
			</Suspense>
		),
		[filters, tickets]
	);

	if (id && className) {
		return (
			<div className={clsx(styles.ticket_overview)}>
				<Table
					columns={columns}
					data={tickets ? tickets : []}
					pagination={pagination}
					setPagination={setPagination}
					rowCount={count}
					filterContent={siteHeaderContent}
				/>
			</div>
		);
	}

	return (
		<Page
			title={siteContent.title}
			description={siteContent.description}
			refetch={refetch}
		>
			<div className={clsx(styles.ticket_overview)}>
				<Table
					columns={columns}
					data={tickets ? tickets : []}
					pagination={pagination}
					setPagination={setPagination}
					rowCount={count}
					filterContent={siteHeaderContent}
				/>
			</div>
		</Page>
	);
};

export default Tickets;
