"use client";

import React, { Suspense, useEffect, useMemo } from "react";
import styles from "./Tickets.module.scss";
import { useDataHandler, useDataStore } from "@repo/provider";
import { TicketsComponent } from "./types";
import clsx from "clsx";
import { useSearchParams } from "next/navigation";
import SiteHeaderContent from "./components/SiteHeaderContent";
import { Filter } from "@repo/types";
import { useCallback, useState } from "react";
import useTicketColumns from "./hooks/useTicketColumns";
import { Modal, Page, Table } from "@repo/ui";

const Tickets = ({ id, className, pageState = "open" }: TicketsComponent) => {
	const [filters, setFilters] = React.useState([] as Filter[]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 20
	});

	const { tickets: storeTickets, getTickets } = useDataStore();
	const count = storeTickets.length;

	const tickets = getTickets(
		filters,
		pagination.pageIndex * pagination.pageSize,
		pagination.pageSize,
		id || ""
	);

	const searchParams = useSearchParams();
	const { updateData, deleteData } = useDataHandler();
	const [selectedRows, setSelectedRows] = useState<string[]>([]);
	const [archiveTickets, setArchiveTickets] = useState<boolean>(false);
	const [deleteTickets, setDeleteTickets] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	const archiveTicket = useCallback(async (objectId: string) => {
		await updateData({
			className: "Ticket",
			objectId,
			updateObject: {
				archived: true
			}
		});
	}, []);

	const deleteTicket = useCallback(async (objectId: string) => {
		await deleteData({
			className: "Ticket",
			objectId
		});
	}, []);

	const columns = useTicketColumns({ archiveTicket, deleteTicket });

	const initialFilters: () => Filter[] = useCallback(() => {
		const filterArray: Filter[] = [];
		if (pageState === "open") {
			filterArray.push({
				key: "state",
				value: "open",
				operator: "equalTo",
				id: "state"
			});
		} else if (pageState === "in_progress") {
			filterArray.push({
				key: "state",
				value: "in_progress",
				operator: "equalTo",
				id: "state"
			});
		} else if (pageState === "closed") {
			filterArray.push({
				key: "state",
				value: "closed",
				operator: "equalTo",
				id: "state"
			});
		}
		if (searchParams.get("ticket")) {
			filterArray.push({
				key: "objectId",
				value: searchParams.get("ticket") as string,
				operator: "equalTo",
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

	const pageHeaderButtons = useMemo(() => {
		if (pageState === "closed") {
			return [
				{
					text: "Tickets archivieren",
					onClick: () => {
						setArchiveTickets(true);
					},
					icon: "archive",
					disabled: selectedRows.length === 0
				},
				{
					text: "Tickets löschen",
					onClick: () => {
						setDeleteTickets(true);
					},
					icon: "delete",
					disabled: selectedRows.length === 0
				}
			];
		} else if (pageState === "in_progress") {
			return [
				{
					text: "Tickets schließen",
					onClick: async () => {
						setLoading(true);
						await Promise.all(
							selectedRows.map((id) => {
								return updateData({
									className: "Ticket",
									objectId: id,
									updateObject: {
										state: "closed"
									}
								});
							})
						);
						setSelectedRows([]);
						setLoading(false);
					},
					icon: "archive",
					disabled: selectedRows.length === 0
				},
				{
					text: "Tickets löschen",
					onClick: () => {
						setDeleteTickets(true);
					},
					icon: "delete",
					disabled: selectedRows.length === 0
				}
			];
		} else if (pageState === "open") {
			return [
				{
					text: "In Bearbeitung",
					onClick: async () => {
						setLoading(true);
						await Promise.all(
							selectedRows.map((id) => {
								return updateData({
									className: "Ticket",
									objectId: id,
									updateObject: {
										state: "in_progress"
									}
								});
							})
						);
						setSelectedRows([]);
						setLoading(false);
					},
					icon: "archive",
					disabled: selectedRows.length === 0
				},
				{
					text: "Tickets löschen",
					onClick: () => {
						setDeleteTickets(true);
					},
					icon: "delete",
					disabled: selectedRows.length === 0
				}
			];
		} else return [];
	}, [loading, selectedRows]);

	return (
		<Page
			title={siteContent.title}
			description={siteContent.description}
			pageHeaderButtons={pageHeaderButtons}
		>
			<div className={clsx(styles.ticket_overview)}>
				<Table
					columns={columns}
					data={tickets ? tickets : []}
					pagination={pagination}
					setPagination={setPagination}
					rowCount={count}
					filterContent={siteHeaderContent}
					enableRowSelection
					selectedRows={selectedRows}
					setSelectedRows={setSelectedRows}
				/>
			</div>
			<Modal
				header="Tickets archivieren"
				isOpen={archiveTickets}
				confirmButtonText="Tickets archivieren"
				cancelButtonHandler={() => setArchiveTickets(false)}
				buttonDisabled={[loading, loading]}
				confirmButtonHandler={async () => {
					setLoading(true);
					await Promise.all(
						selectedRows.map((id) => {
							return archiveTicket(id);
						})
					);
					setSelectedRows([]);
					setArchiveTickets(false);
					setLoading(false);
				}}
			>
				<p>
					Sind Sie sicher, dass Sie {selectedRows.length} Tickets
					archivieren möchten?
				</p>
			</Modal>
			<Modal
				header="Tickets löschen"
				isOpen={deleteTickets}
				confirmButtonText="Tickets löschen"
				cancelButtonHandler={() => setArchiveTickets(false)}
				buttonDisabled={[loading, loading]}
				confirmButtonHandler={async () => {
					setLoading(true);
					await Promise.all(
						selectedRows.map((id) => {
							return deleteTicket(id);
						})
					);
					setSelectedRows([]);
					setDeleteTickets(false);
					setLoading(false);
				}}
			>
				<p>
					Sind Sie sicher, dass Sie {selectedRows.length} Tickets
					löschen möchten?
				</p>
			</Modal>
		</Page>
	);
};

export default Tickets;
